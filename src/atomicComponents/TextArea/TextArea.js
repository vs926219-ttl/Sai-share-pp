import React from 'react';
import PropTypes from 'prop-types';
import { ValidatingTextField } from '../../components/FormComponents';

const TextArea = ({ description, setDescription }) => (
    <ValidatingTextField
        style={{fontSize: 14}}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        rows={4}
        value={description}
        // resetAllVisitedFields={resetAllVisitedFields}
        onChange={(e) => setDescription(e.target.value)}
        // placeholder={''}
        inputProps={{
            "data-testid": "remark-input",
        }}
    />
  )

TextArea.propTypes = {
    description: PropTypes.string,
    setDescription: PropTypes.func.isRequired,
};

export default TextArea;
