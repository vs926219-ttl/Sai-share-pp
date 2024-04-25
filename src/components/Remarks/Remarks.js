/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styles from './Remarks.module.css'
import { ValidatingTextField } from '../FormComponents'
import { DATE_FORMAT } from '../../constants'

const List = ({ list }) => (
  <div className={styles.listWrapper}>
    <ul>
      {list?.map((item) => {
        if (item.remark)
          return (
            <li style={{ backgroundColor: item.color, border: "none", borderRadius: "4px" }}>
              <div>
              <span className={styles.topContentLift}>
                  <strong>
                    {item?.user?.name.replace(/-/g, " ").charAt(0).toUpperCase() +
                      item?.user?.name.replace(/-/g, " ").slice(1)}
                  </strong>
                </span>
                <span className={styles.topContentRight}>
                  <strong>
                    {moment(item?.createdAt).format(DATE_FORMAT.DD_MM_YYYY)}
                  </strong>
                </span>
              </div>
              <br/>
              <div>{item.remark}</div>
            </li>
          );
        return null;
      })}
    </ul>
  </div>
);

List.propTypes = {
  list: PropTypes.array
};

function Remarks({ disableInput, comments, getRemark }) {
  const [remark, setRemark] = useState('');
  const color = ['#FFE6B5', '#EAF4FF', '#F4EAFF'];

  const unique = [...new Set(comments.map(item => item.user))]

  comments.forEach(uni => {
    if (uni.user === unique[0]) {
      uni.color = color[0];
    }
    else if
      (uni.user === unique[1]) {
      uni.color = color[1]
    }
    else if
      (uni.user === unique[2]) {
      uni.color = color[2]
    }
    else
      uni.color = '#FFFF'
  });

  return (
    <div className={styles.container}>
      <ValidatingTextField
        style={{ fontSize: 14 }}
        isDisabled={disableInput}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        rows={4}
        value={remark}
        onChange={(e) => {
          setRemark(e.target.value)
        }}
        onBlur={() => getRemark(remark)}
        inputProps={{
          "data-testid": "remark-input",
        }}
      />
      {comments && comments.length > 0 && <List list={comments} />}
    </div>
  );
}

Remarks.propTypes = {
  disableInput: PropTypes.bool,
  comments: PropTypes.array,
  getRemark: PropTypes.func
}

export default Remarks