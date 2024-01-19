import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import styles from './List.module.css';

const List = ({ list }) => (
    <div className={styles.listWrapper}>
        <ul>
            {list?.map(item => {
                if (item.remark)
                    return (
                        <li>
                            <div>{item.remark}</div>
                            <div className={styles.bottomContent}>
                                <span>{moment(item?.createdAt).format("DD/MM/YYYY")}</span>
                                <span><strong>{item?.user?.name.replace(/-/g," ").charAt(0).toUpperCase() + item?.user?.name.replace(/-/g," ").slice(1)}</strong></span>
                            </div>
                        </li>
                    )
                return null;    
                }
            )}
        </ul>
    </div>
)

List.propTypes = {
    list: PropTypes.array 
};

export default List;
