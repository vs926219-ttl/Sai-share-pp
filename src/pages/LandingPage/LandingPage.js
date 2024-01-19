/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ListView,
  useContextHandler,
} from '@tmlconnected/avant-garde-components-library';
import styles from './LandingPage.module.css';
import {  SubHeader, ToolsListView } from '../../components';
import { USER_OPERATIONS, PPAP_APP_NAME } from '../../constants';
import { useAuthorizationContext } from '../../providers/AuthorizationHandler/AuthorizationHandler';
import useAuthorizedEpApps from '../../hooks/useAuthorizedEpApps';
import { usePopupManager } from '../../providers/PopupManager/PopupManager';
import config from '../../config/config';

function LandingPage() {
  const { isAuthenticated, user, authResources } = useAuthorizationContext();
  const history = useHistory();
  const [selectedColumnsQueue, setSelectedColumsQueue] = useState([]);
  const [columnsRoot, setColumnsRoot] = useState();
  const authorizedApps = useAuthorizedEpApps(isAuthenticated, authResources);
  const { showLoading } = usePopupManager();
  const { navigationData } = useContextHandler();
 
  const handleSelection = selection =>
    setSelectedColumsQueue(prev => {
      if (prev.length) {
        const lastSelection = prev[prev.length - 1];
        if (lastSelection === selection) return prev;
        while (prev.length) {
          const existingTopLevel = prev[prev.length - 1].level;
          if (existingTopLevel >= selection.level) prev.pop();
          else break;
        }
      }
      prev.push(selection);
      return [...prev];
    });

  const getArrayOfOptionSetsToRender = queue =>
    queue.map(item => item.next).filter(item => item);

  const getToolOptions = () =>
    [
      {
        label: 'Project Master',
        action: () => {
          history.push('/project-master');
        },
        authOperation: USER_OPERATIONS.CREATE_PROJECT,
        testId: 'project-master-btn'
      },
      {
        label: 'Document Master',
        action: () => {
          history.push('/document-master');
        },
        authOperation: USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
        testId: 'document-master-btn'
      },
    ];

  const toolOptions = getToolOptions();

  useEffect(() => {
    setColumnsRoot([
      {
        label: 'PROCESS',
        next: null,
        level: 1,
        action: () => {
          history.push('/process');
        },
      },
    ]);
  }, [])
  
   useEffect(() => {
     navigationData?.length &&
       navigationData?.map((label) => {
         const columns = columnsRoot?.map((rootColumn) => {
           if (label === rootColumn.label) handleSelection(rootColumn);
           return rootColumn.next;
         });

         columns &&
           columns[0]?.map((column) => {
             if (label === column.label) handleSelection(column);
             column?.next?.map((nextCl) => {
               if (navigationData.length > nextCl.level - 1)
                 handleSelection(nextCl);
               nextCl?.next?.map((item) => {
                 if (navigationData.length > item.level - 1)
                   handleSelection(item);
                 return item;
               });
               return nextCl;
             });
             return column;
           });

         return label;
       });
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [columnsRoot]);

  useEffect(() => {
    if (
      authorizedApps.length &&
      !authorizedApps.includes(PPAP_APP_NAME)
    ) {
      showLoading();
      window.location.replace(config.HOME_UI_BASE_URL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorizedApps, user.userID]);

  useEffect(() => {
    if (authResources.allowed && !authResources.allowed?.length) {
      showLoading();
      window.location.replace(config.HOME_UI_BASE_URL);
    }
  }, [authResources]);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '1em' }}>
        <SubHeader title="eSAKHA" />
      </div>
      <div className={styles.columnsContainer}>
        <div style={{ height: '100%' }} className={styles.columnsContainerLeft}>
          <ListView
            title="Select"
            listItems={columnsRoot}
            handleSelection={handleSelection}
            styleClass={{
              'listItemStyle': styles.listItem,
              'selectedStyle': styles.selected,
            }}
            search
          />
          {getArrayOfOptionSetsToRender(selectedColumnsQueue).map(
            (listItems, index) => (
              <ListView
                key={`${selectedColumnsQueue[0].label}-${listItems[0]?.level}`}
                title={index === 1 ? 'Action' : 'Select'}
                listItems={listItems}
                handleSelection={handleSelection}
                index={index}
                styleClass={{
                  'listItemStyle': styles.listItem,
                  'selectedStyle': styles.selected,
                }}
                search
              />
            ),
          )}
        </div>
        <div style={{ height: '100%' }}>
          <ToolsListView
            listItems={toolOptions}
            handleSelection={handleSelection}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage