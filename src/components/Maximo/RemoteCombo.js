import React, { useState, useEffect } from "react";

import PropTypes from 'prop-types'

import Select from "react-select/async";

import { Spinner } from "reactstrap";

const RemoteCombo = props => {
    const [localValue, setLocalValue] = useState(null);
    const [initOptions, setInitOptions] = useState([]);
    
    const filterOptions = (inputValue) => {
        return initOptions.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const loadOptions = ( inputValue, callback ) => {
        setTimeout(() => {
            let options = filterOptions(inputValue);
            callback(options);
        }, 1000);
    };

    const onChange = (val)=>{
        setLocalValue(val);
        props.onChange(val);
    };
  
    useEffect(()=>{
        setInitOptions(props.data);
    },[props.data]);
    
    useEffect(()=>{
        setLocalValue(props.value);
    },[props.value]);

    if(initOptions.length||props.disabled){
        return (<Select
            value={localValue}
            onChange={onChange}
            defaultOptions={initOptions}
            loadOptions={loadOptions} 
            className="select2-selection"
            placeholder={props.placeholder||'Seleccionar'}
            isDisabled={props.disabled}
            theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors
                },
            })}
        />);
    }else{
        return (<><Spinner className="ms-12" color="dark" /></>);
    }
}

RemoteCombo.propTypes = {
    onChange: PropTypes.func
}

export default RemoteCombo
