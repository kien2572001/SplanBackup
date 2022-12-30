import { Checkbox } from "antd";
import { relativeTimeRounding } from "moment";
import React, { useState,useEffect } from "react";

const ModalContent = ({change}) => {
    const [checkbox1,setCheckBox1] = useState(false);
    const [checkbox2,setCheckBox2] = useState(false);
    const [checkbox3,setCheckBox3] = useState(false);
   
  useEffect (() => {
    
    if(checkbox1&&checkbox2&&checkbox3){
        
        change(false); 
    } else {
       
       change(true); 
    }
},[checkbox1,checkbox2,checkbox3,change])
 return (<>
<div className="flex flex-col">
<div>削除後に復元できません。</div>
<span><Checkbox onChange={(event) => {setCheckBox1(event.target.checked)}}>このユーザに関連する「いいね」がすべて削除されることを理解しています。</Checkbox></span>
<span><Checkbox onChange={(event) => {setCheckBox2(event.target.checked)}}>このユーザに関連する投稿がすべて削除されることを理解しています。</Checkbox> </span>
<span><Checkbox onChange={(event) => {setCheckBox3(event.target.checked)}}>このユーザに関連するコメントがすべて削除されることを理解しています。</Checkbox></span>
</div>
</>
 );
 
}
export default React.memo(ModalContent);