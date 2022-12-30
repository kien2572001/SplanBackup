import { Form } from "antd";
import React from "react";

const EachInput = ({ label, partId, rules, children, defaultValue }) => {
  
  return(
    <Form.Item 
      name={`${label}-${partId}`}
      rules={rules}
      initialValue={defaultValue}
    >
      <div className="flex justify-between items-end">
        <label 
          className="text-xl text-default font-normal" 
          style={{
            fontSize: '1.25rem'
          }}
        >
          {label}
          <span className="text-red-400 mx-1">*</span>
        </label>
        {children}
      </div>
    </Form.Item>

  )
}

export default React.memo(EachInput);
