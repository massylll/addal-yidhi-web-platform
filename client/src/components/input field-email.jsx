import React from 'react';

// Functional Component
const InputField = ({label,placeholder,logo}) => {
  return (
<div style={{fontFamily:"cursive",width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
    <div style={{width: 400, color: '#464748', fontSize: 14, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word'}}>{label}</div>
    <div style={{width:400, padding: 16, background: '#F6F6F6', borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 15, display: 'inline-flex'}}>
    <div style={{width:18,height:18}}> <img src={logo}  /> </div>
        <div style={{flex: '1 1 0', height: 18, color: '#767676', fontSize: 14, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}><input placeholder={placeholder}/></div>
    </div>
</div>
  );
};

export default InputField;