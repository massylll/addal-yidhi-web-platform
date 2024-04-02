import React from 'react';

// Functional Component
const Buttond = ({label,color}) => {
return(
    <button style={{height: 30, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 10, display: 'flex', border: 'none', background: 'none', cursor: 'pointer'}}>
    <div style={{width: 55, paddingLeft: 5, paddingRight: 5, paddingTop: 12, paddingBottom: 12, background: '#683CE4', borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
        <div  style={{color: 'white', fontSize: 12, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word'}}>{label }</div>
    </div>
</button>
)
};

export default Buttond;