/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import DehazeOutlinedIcon from '@material-ui/icons/DehazeOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import { Button } from '@tmlconnected/avant-garde-components-library';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { API } from '../../apis/api';
import { buildErrorMessage } from '../../apis/calls';
import { AuthChecker } from '../../atomicComponents';
import {
  GridLoadingSpinner,
  Panel,
  ProcessDetailsView,
  ProcessList,
  ProcessTabs,
} from '../../components';
import {
  API_RESOURCE_URLS,
  HATEAOS_LINKS,
  RESOURCE_TYPE,
  USER_OPERATIONS,
} from '../../constants';
import { withAllowedOperationsProvider } from '../../hocs';
import { useAuthorizationContext } from '../../providers/AuthorizationHandler/AuthorizationHandler';
import { usePopupManager } from '../../providers/PopupManager/PopupManager';
import {
  SET_DATALIST,
  SET_FILTER_INPUT,
  SET_LIST,
  SET_OPEN_CHILDMENU,
  SET_STAGES,
  SET_STATUS,
} from '../../redux/features/filter/actionTypes';
import { getApiRelativeUrl } from '../../utils/utils';
import styles from './Process.module.css';

function Process() {
  const history = useHistory();
  const { user } = useAuthorizationContext();
  const { showInternalError } = usePopupManager();

  const [todoList, setTodoList] = useState({
    reload: false,
    loading: false,
    data: [],
    last: false,
    number: 0,
    totalElements: 0,
  });

  const [overviewList, setOverviewList] = useState({
    reload: false,
    loading: false,
    data: [],
    last: false,
    number: 0,
    totalElements: 0,
  });

  const [reload1, setReload] = useState(false);
  const [ppap, setPpap] = useState({ loading: false, data: {} });
  const [search, setSearchInput] = useState(null);
  const { filter, dataList, stages, status, menu } = useSelector(
    (state) => state.filters
  );

  const dispatch = useDispatch();
  const [supplierId, setSupplierId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (value) => {
    if (value === 0)
      setTodoList((prev) => ({
        ...prev,
        number: 0,
      }));
    else
      setOverviewList((prev) => ({
        ...prev,
        number: 0,
      }));
    setSelectedTab(value);
    dispatch({
      type: SET_OPEN_CHILDMENU,
      payload: false,
    });
    dispatch({
      type: SET_FILTER_INPUT,
      payload: null,
    });
    dispatch({
      type: SET_DATALIST,
      payload: [],
    });
  };

  const [todoCount, setTodoCount] = useState(0);
  const setTodoListCount = (count) => {
    setTodoCount(count);
  };

  const [overviewCount, setOverviewCount] = useState(0);
  const setOverviewListCount = (count) => {
    setOverviewCount(count);
  };

  const [hambugerOpen, setHambugerOpen] = useState(true);
  const toggleHamburger = () => {
    setHambugerOpen(!hambugerOpen);
  };

  const getStageAndStatus = async () => {
    const response = await API.get(API_RESOURCE_URLS.PPAP_STAGES);
    const { data: stage } = response;
    stage.unshift({ id: 0, name: 'INITIATE' });
    stage.push({ id: 5, name: 'APQP' });
    stage.push({ id: 6, name: 'COMPLETE' });
    stage.push({ id: 7, name: 'TERMINATE' });
    dispatch({
      type: SET_STAGES,
      payload: stage,
    });
    const statusResponse = await API.get(API_RESOURCE_URLS.PPAP_STATUS);
    const { data: statuses } = statusResponse;
    // eslint-disable-next-line arrow-body-style
    const finalStatus = statuses.map((st, index) => {
      return { id: index, name: st };
    });
    dispatch({
      type: SET_STATUS,
      payload: finalStatus,
    });
  };

  useEffect(() => {
    getStageAndStatus();
  }, []);

  useEffect(() => {
    if (menu)
      dispatch({
        type: SET_OPEN_CHILDMENU,
        payload: true,
      });
    if (menu === 'Stage') {
      dispatch({
        type: SET_LIST,
        payload: stages,
      });
    } else if (menu === 'Process') {
      dispatch({
        type: SET_LIST,
        payload: status,
      });
    }
  }, [menu]);

  useEffect(() => {
    if (dataList.length === 0)
      dispatch({
        type: SET_FILTER_INPUT,
        payload: null,
      });
  }, [dataList]);

  const getSupplierDetail = async () => {
    try {
      const response = await API.get(
        API_RESOURCE_URLS.getSupplierId(user.supplierCode)
      );
      const { data } = response;
      const { id } = data;
      setSupplierId(id);
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
    }
  };

  const getPpapDetailsForPpapId = async (url) => {
    try {
      setPpap({ loading: true, data: {} });
      const response = await API.get(url);
      const { data: ppapResponseFromApi } = response;
      setPpap({ loading: false, data: ppapResponseFromApi });
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setPpap({ loading: false, data: {} });
    }
  };

  const redirectToCreateProcess = () => {
    history.push('/create-process');
  };

  const handleClick = (index, list, setState) => {
    setState((prev) => ({
      ...prev,
      data: prev.data.map((item, idx) => {
        if (idx === index) {
          return { ...item, isSelected: true };
        }
        return { ...item, isSelected: false };
      }),
    }));
    const { href } = list[index].links.find(
      ({ rel }) => rel === HATEAOS_LINKS.PPAP || rel === 'self'
    );
    const url = getApiRelativeUrl(href);
    getPpapDetailsForPpapId(url);
  };

  const callAPI = async (stage, statuses, sort) => {
    let APILink;
    let length;
    // eslint-disable-next-line no-return-assign, no-param-reassign
    const updatedStages = stage.map((st) => {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      if (st === 'R@R') return 'RUN_AT_RATE';
      return st;
    });
    // eslint-disable-next-line no-unused-expressions
    selectedTab === 0
      ? ((APILink = API_RESOURCE_URLS.TASKS), (length = todoList.number))
      : ((APILink = !user.supplierCode
          ? API_RESOURCE_URLS.PPAP
          : API_RESOURCE_URLS.getSupplierListOfPpap(supplierId)),
        (length = overviewList.number));
    const response = await API.get(`${APILink}`, {
      params: {
        page: length,
        size: 20,
        stage: [...updatedStages],
        status: [...statuses],
        sort,
      },
    });
    const { data } = response;
    if (selectedTab === 0) {
       const { content } = data;
      setTodoList({
        reload: false,
        data: content,
        loading: false,
        last: true,
        number: 0,
        totalElements: data.length,
      });
    } else if (selectedTab === 1) {
      const { content } = data;
      const tempList = content.map((item) => {
        const hrefLink = item.links.find((link) => {
          if (link.rel === 'self') return link.href;
        });
        return {
          ...item,
          ppapId: item.id,
          projectCode: item?.project?.code,
          partNumber: item.part.number,
          commodity: item.commodityGroup,
          supplierCode: item.supplier.code,
          isSelected: false,
          links: [
            {
              href: hrefLink.href,
              rel: 'self',
            },
          ],
        };
      });
      setOverviewList({
        reload: false,
        data: tempList,
        loading: false,
        last: true,
        number: 0,
        totalElements: tempList.length,
      });
    }
  };

  const removeChip = (index) => {
    const newData = dataList?.slice();
    newData.splice(index, 1);
    dispatch({
      type: SET_DATALIST,
      payload: newData,
    });
  };
  useEffect(() => {
    const stage = [];
    const statuses = [];
    let sort = '';
    dataList.map((val) => {
      if (val.name === 'Stage') {
        stage.push(val.value);
      }
      if (val.name === 'Process') {
        statuses.push(val.value);
      }
      if (val.name === 'Sort') {
        sort = val.value;
      }
    });
    // eslint-disable-next-line no-unused-expressions
    dataList.length && callAPI(stage, statuses, sort);
  }, [dataList]);
  const tabs = [
    {
      label: 'To Do List',
      title: 'To Do List',
      count: todoCount,
      component: ProcessList,
      props: {
        data: todoList.data,
        pagination: {
          last: todoList.last,
          setState: setTodoList,
        },
        handleClick,
        searchInput: (e) => {
          setSearchInput(e);
        },
        removeChip,
      },
    },
    {
      label: 'Overview',
      title: 'Overview',
      count: overviewCount,
      component: ProcessList,
      props: {
        data: overviewList.data,
        pagination: {
          last: overviewList.last,
          setState: setOverviewList,
          removeChip,
        },
        handleClick,
        searchInput: (e) => {
          setSearchInput(e);
        },
        removeChip,
      },
    },
  ];
  const processTodoData = (data) => {
    let processedData = {};

    const processedList = data.content.map((item) => ({
      ...item,

      name: item.description,
      isSelected: false,
    }));

    processedData = {
      ...data,
      content: processedList,
    };

    return processedData;
  };
  const getTodoList = async () => {
    try {
      setTodoList((prev) => ({
        ...prev,
        loading: true,
      }));
      if ((!search || search === null) && !filter) {
        const response = await API.get(API_RESOURCE_URLS.TASKS, {
          params: {
            page: todoList.number,
            size: 20,
          },
        });

        const { data: todoListFromApi } = response;
        const processedTodoData = processTodoData(todoListFromApi);
        const { content, last, totalElements } = processedTodoData;

        setTodoList((prev) => ({
          ...prev,
          reload: false,
          data:
            todoList.number !== 0 ? [...prev.data, ...content] : [...content],
          loading: false,
          last,
          totalElements,
        }));
      } else if (search && selectedTab === 0) {
        const response = await API.get(API_RESOURCE_URLS.PPAP_TASKS, {
          params: {
            ppapId: search || undefined,
          },
        });
        const { data } = response;
        setTodoList({
          reload: false,
          data,
          loading: false,
          last: false,
          number: 0,
          totalElements: data.length,
        });
      } else if (
        (!search || search === null) &&
        selectedTab === 0 &&
        dataList.length
      ) {
        const stage = [];
        const statuses = [];
        let sort = '';
        dataList.map((val) => {
          if (val.name === 'Stage') {
            stage.push(val.value);
          }
          if (val.name === 'Process') {
            statuses.push(val.value);
          }
          if (val.name === 'Sort') {
            sort = val.value;
          }
        });
        callAPI(stage, statuses, sort);
      }
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setTodoList({
        reload: false,
        data: [],
        loading: false,
        last: false,
        number: 0,
        totalElements: 0,
      });
    }
  };
  const reloadTodoListAndreloadOverviewList = (list = []) => {
    if (list[0]) {
      const { href } = list[0].links.find(
        ({ rel }) => rel === HATEAOS_LINKS.PPAP || rel === 'self'
      );
      const url = getApiRelativeUrl(href);
      getPpapDetailsForPpapId(url);
    }
    if (list.length === 0) {
      setPpap({ loading: false, data: {} });
    }
  };

  const reloadTododList = async () => {
    try {
      const response = await API.get(API_RESOURCE_URLS.TASKS, {
        params: {
          page: todoList.number,
          size: 20,
        },
      });
      const { data: todoListFromApi } = response;
      const processedTodoData = processTodoData(todoListFromApi);
      const { content, totalElements, last } = processedTodoData;

      let list = [];

      setTodoList((prev) => {
        list =
          todoList.number !== 0
            ? [...prev.data, ...content].map((item, idx) => {
                if (idx === 0 && selectedTab === 0) {
                  return { ...item, isSelected: true };
                }
                return { ...item, isSelected: false };
              })
            : [...content].map((item, idx) => {
                if (idx === 0) {
                  return { ...item, isSelected: true };
                }
                return { ...item, isSelected: false };
              });
        return {
          ...prev,
          reload: false,
          data: list,
          loading: false,
          totalElements,
          last,
        };
      });
      if (selectedTab === 0) {
        reloadTodoListAndreloadOverviewList(list);
      }
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setTodoList({
        reload: false,
        data: [],
        loading: false,
        number: 0,
        totalElements: 0,
      });
    }
  };
  const processOverviewData = (data) => {
    let processedData = {};

    const processedList = data.content.map((item) => ({
      ...item,
      ppapId: item.id,
      projectCode: item.project.code,
      partNumber: item.part.number,
      commodity: item.commodityGroup,
      supplierCode: item.supplier.code,
      isSelected: false,
    }));
    processedData = {
      ...data,
      content: processedList,
    };

    return processedData;
  };

  const getOverviewList = async () => {
    try {
      setOverviewList((prev) => ({
        ...prev,
        loading: true,
      }));
      if ((!search || search === null) && !filter) {
        const response = await API.get(
          !user.supplierCode
            ? API_RESOURCE_URLS.PPAP
            : API_RESOURCE_URLS.getSupplierListOfPpap(supplierId),
          {
            params: {
              page: overviewList.number,
              size: 20,
            },
          }
        );

        const { data: overviewListFromApi } = response;
        const processedOverviewData = processOverviewData(overviewListFromApi);
        const { content, last, totalElements } = processedOverviewData;

        setOverviewList((prev) => ({
          ...prev,
          reload: false,
          data:
            overviewList.number !== 0
              ? [...prev.data, ...content]
              : [...content],
          loading: false,
          last,
          totalElements,
        }));
      } else if (search && selectedTab === 1) {
        const response = await API.get(API_RESOURCE_URLS.getPpap(search));
        const { data } = response;
        const { _links: links } = data;
        const tempList =
          data && data.id
            ? [
                {
                  ...data,
                  ppapId: data.id,
                  projectCode: data.project.code,
                  partNumber: data.part.number,
                  commodity: data.commodityGroup,
                  supplierCode: data.supplier.code,
                  isSelected: false,
                  links: [{ href: links?.self?.href, rel: 'self' }],
                },
              ]
            : [];
        setOverviewList({
          reload: false,
          data: tempList,
          loading: false,
          last: false,
          number: 0,
          totalElements: 1,
        });
      } else if ((!search || search === null) && dataList.length) {
        const stage = [];
        const statuses = [];
        let sort = '';
        dataList.map((val) => {
          if (val.name === 'Stage') {
            stage.push(val.value);
          }
          if (val.name === 'Process') {
            statuses.push(val.value);
          }
          if (val.name === 'Sort') {
            sort = val.value;
          }
        });
        callAPI(stage, statuses, sort);
      }
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setOverviewList({
        data: [],
        loading: false,
        last: false,
        number: 0,
        totalElements: 0,
      });
    }
  };

  const reloadOverviewList = async () => {
    try {
      const response = await API.get(
        !user.supplierCode
          ? API_RESOURCE_URLS.PPAP
          : API_RESOURCE_URLS.getSupplierListOfPpap(supplierId),
        {
          params: {
            page: overviewList.number,
            size: 20,
          },
        }
      );
      const { data: overviewListFromApi } = response;

      const processedOverviewData = processOverviewData(overviewListFromApi);

      const { content, last, totalElements } = processedOverviewData;

      let list = [];

      setOverviewList((prev) => {
        list =
          overviewList.number !== 0
            ? [...prev.data, ...content].map((item, idx) => {
                if (idx === 0 && selectedTab === 1) {
                  return { ...item, isSelected: true };
                }
                return { ...item, isSelected: false };
              })
            : [...content].map((item, idx) => {
                if (idx === 0) {
                  return { ...item, isSelected: true };
                }
                return { ...item, isSelected: false };
              });
        return {
          ...prev,
          reload: false,
          data: list,
          loading: false,
          totalElements,
          last,
        };
      });
      if (selectedTab === 1) {
        reloadTodoListAndreloadOverviewList(list);
      }
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setOverviewList({
        reload: false,
        data: [],
        loading: false,
        number: 0,
        totalElements: 0,
      });
    }
  };
  useEffect(() => {
    getTodoList();
  }, [todoList.number, search, filter]);

  useEffect(() => {
    if (supplierId !== null) getOverviewList();
  }, [overviewList.number, search, supplierId, filter]);

  useEffect(() => {
    if (!user.supplierCode) getOverviewList();
  }, [overviewList.number, search, filter]);

  useEffect(() => {
    if (user.supplierCode) getSupplierDetail();
  }, []);

  useEffect(() => {
    if (reload1 === true) {
      reloadTododList();
      reloadOverviewList();
      setReload(false);
    }
  }, [reload1]);

  useEffect(() => {
    if (selectedTab === 0) {
      reloadTododList();
    }
    if (selectedTab === 1) {
      reloadOverviewList();
    }
  }, [selectedTab]);

  useEffect(() => {
    setTodoListCount(todoList.totalElements);
  }, [todoList.totalElements]);

  useEffect(() => {
    setOverviewListCount(overviewList.totalElements);
  }, [overviewList.totalElements]);

  if (ppap.loading) {
    return (
      <div className={styles.gridLoader}>
        <GridLoadingSpinner />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {hambugerOpen ? (
        <NotesOutlinedIcon
          className={styles.clickable}
          onClick={() => toggleHamburger()}
        />
      ) : (
        <DehazeOutlinedIcon
          className={styles.clickable}
          onClick={() => toggleHamburger()}
        />
      )}
      {hambugerOpen ? (
        <div className={styles.processListView} open={hambugerOpen}>
          <div className={styles.tabsContainer}>
            <ProcessTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
            />
          </div>
          <div className={styles.content}>
            {tabs.map((tab, index) => (
              <Panel value={selectedTab} index={index}>
                <tab.component {...tab.props} />
              </Panel>
            ))}
          </div>
          <div className={styles.actionBar}>
            <AuthChecker operation={USER_OPERATIONS.CREATE_PPAP}>
              {(isAuthorized) =>
                isAuthorized && (
                  <Button
                    className={styles.actionButton}
                    variant='tertiary'
                    onClick={redirectToCreateProcess}
                  >
                    NEW PROCESS
                  </Button>
                )
              }
            </AuthChecker>
          </div>
        </div>
      ) : null}
      <ProcessDetailsView
        ppap={ppap}
        setReload={setReload}
        setTodoList={setTodoList}
        setOverviewList={setOverviewList}
        hambugerOpen={hambugerOpen}
        redirectToCreateProcess={redirectToCreateProcess}
      />
    </div>
  );
}

export default withAllowedOperationsProvider(Process, RESOURCE_TYPE.PPAP);
