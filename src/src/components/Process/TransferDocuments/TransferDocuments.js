/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import React, {useReducer, useEffect, useState} from "react";
import PropTypes from "prop-types";
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRight';
import { Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from "./TransferDocuments.module.css";

const useStyles = makeStyles({
    root: {
        color: '#C9AF28 !important',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
})

const initialState = {
    allDocuments: [],
    mandatoryDocuments: [],
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'update':
        return {
            ...state,
            [action.field]: action.value
        }
        case 'reset':
        return {
            ...state,
            ...initialState
        }
        default:
        return state
    }
}

function TransferDocuments( {documentList, onSelect, addedDocuments} ) {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectAllDocs, setSelectAllDoc] = useState(false);
    const [selectAllMasterDocs, setSelectAllMasterDoc] = useState(false);

    const { allDocuments, mandatoryDocuments } = state;

    const onSelectDocument = (e, document, index) => {
        console.log(e)
        if(e){
            allDocuments[index]['checked'] = true;
            dispatch({ type: 'update', field: 'allDocuments', value: allDocuments });
        }else{
            allDocuments[index]['checked'] = false;
            dispatch({ type: 'update', field: 'allDocuments', value: allDocuments });
        }
    }
    const moveToRight = () => {
        allDocuments.filter(x => x.checked).forEach(doc => {
            const findDoc = mandatoryDocuments && mandatoryDocuments.find(y => y.id === doc.id);
            if(!findDoc) mandatoryDocuments.push({...doc, checked: false});
        });

        dispatch({ type: 'update', field: 'mandatoryDocuments', value: mandatoryDocuments });
        setSelectAllDoc(false);
        onSelect([...mandatoryDocuments]);
        allDocuments.forEach(x => {x.checked = false});
    }
    const moveToLeft = () => {
        const findDoc = mandatoryDocuments.filter(x => x.checked);
        allDocuments.forEach(x => {
            findDoc.forEach(y => {
                if(y.id === x.id) x.checked = false;
            })
        })
        dispatch({ type: 'update', field: 'mandatoryDocuments', value: mandatoryDocuments.filter(x => x.checked === false) });
        setSelectAllMasterDoc(false);
        onSelect([...mandatoryDocuments.filter(x => x.checked === false)]);
    }

    const restructuredDocuments = () => {
        dispatch({ type: 'update', field: 'allDocuments', 
                    value: documentList.data.map(x => ({
                        checked: false,
                        id: x.id,
                        name: x.name
                    })) 
                });
        dispatch({ type: 'update', field: 'mandatoryDocuments', 
                   value: addedDocuments.map(x => ({
                        checked: false,
                        id: x.id,
                        name: x.name
                    })) 
            });
        onSelect([...mandatoryDocuments]);
    }

    const selectAll = (e, list, stateName) => {
        console.log(e);
        stateName === 'allDocuments' ? setSelectAllDoc(e) : setSelectAllMasterDoc(e);
        if(e){
            list.forEach(x => {x.checked = true});
        }else{
            list.forEach(x => {x.checked = false});
        }
        dispatch({ type: 'update', field: stateName, value: list });
    }

    useEffect(() => {
        restructuredDocuments();
    }, [documentList, addedDocuments]);

    return (
      <>
        <div className={styles.listContainer}>
            <div className={styles.list}>
                <h4 style={{margin: '0 0 20px'}}>Document list</h4>
                <div style={{marginLeft:10}}>
                    <Checkbox 
                        size="small"
                        checked={selectAllDocs}
                        className={classes.root}
                        onChange={(e) => {
                            selectAll(e.target.checked, allDocuments, 'allDocuments');
                        }}
                        inputProps={{ 'data-testid': `select-all` }}
                    /> <strong>Select All</strong>
                </div>
                <ul>
                    {allDocuments.map((item,index) => (
                        <li data-testid="list-item" className={item.checked ? styles.selectedItem: null}>
                            <Checkbox
                                checked={item.checked}
                                onChange={(e) => onSelectDocument(e.target.checked, item, index)}
                                size="small"
                                className={classes.root}
                                inputProps={{ 'data-testid': `checkbox-${item.id}` }}
                            />
                            <span>{item.name}</span>  
                        </li>
                    )
                    )}
                    
                </ul>
            </div>
            <div>
                <div className={styles.arrowContainer}>
                    <Button 
                        className={styles.btn}
                        disabled={allDocuments.every(row => !row.checked)}
                        data-testid="RightArrowIcon"
                        >
                        <RightArrowIcon onClick={() => moveToRight()}/>
                    </Button>
                    <Button 
                        className={styles.btn}
                        disabled={mandatoryDocuments.every(row => !row.checked)} 
                        data-testid="LeftArrowIcon"
                        >
                        <LeftArrowIcon onClick={() => moveToLeft()}/>
                    </Button>
                </div>
            </div>
            <div className={styles.list}>
                <h4 style={{margin: '0 0 20px'}}>Master document list</h4>
                {mandatoryDocuments && mandatoryDocuments.length > 0 &&
                    <>
                        <div style={{marginLeft:10}}>
                            <Checkbox 
                                size="small"
                                checked={selectAllMasterDocs}
                                className={classes.root}
                                onChange={(e) => {
                                    selectAll(e.target.checked, mandatoryDocuments, 'mandatoryDocuments');
                                }}
                                inputProps={{ 'data-testid': `master-select-all` }}
                            /> <strong>Select All</strong>
                        </div>
                        <ul>
                            {mandatoryDocuments.map((item,index) => (
                                <li className={item.checked ? styles.selectedItem: null}>
                                    <Checkbox
                                        size="small"
                                        checked={item.checked}
                                        className={classes.root}
                                        onChange={(e) => {
                                            mandatoryDocuments[index].checked = e.target.checked;
                                            dispatch({ type: 'update', field: 'mandatoryDocuments', value: mandatoryDocuments });
                                        }}
                                        inputProps={{ 'data-testid': `master-checkbox-${item.id}` }}
                                    />
                                    <span>{item.name}</span>  
                                </li>
                            )
                            )}
                        </ul>
                    </>
                } 
            </div>
        </div>
      </>
    );
  }
 
  TransferDocuments.propTypes = { 
    documentList: PropTypes.any.isRequired,
    onSelect: PropTypes.func,
    addedDocuments: PropTypes.array
  };
  
  export default TransferDocuments;
  