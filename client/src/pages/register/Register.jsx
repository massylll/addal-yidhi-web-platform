import '../../App.css';
import Buttond from '../../components/button';
import InputField from '../../components/input field-email';

const Register=() =>{
      return (
    <div className="App">
<div style={{paddingTop: 98, paddingBottom: 212, paddingLeft: 386, paddingRight: 386, background: 'linear-gradient(180deg, #3E16B0 0%, #29126A 100%)', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
    <div style={{flex: '1 1 0', alignSelf: 'stretch', paddingTop: 20, paddingBottom: 40, paddingLeft: 60, paddingRight: 60, background: 'white', borderRadius: 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 41, display: 'inline-flex'}}>
        <div style={{color: 'black', fontSize: 32, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>Sign Up</div>
        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 16, display: 'flex'}}>

            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 24, display: 'flex'}}>
                <div style={{color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>Account details</div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>

                </div>

            </div>
            <InputField label="E-mail"placeholder="E-mail" logo='../icons/sms.svg'/>
            <InputField label="Username"placeholder="Username" logo='../icons/user.svg'/>
            <InputField label="Password"placeholder="Password" logo='../icons/lock.svg'/>
            <InputField label="Confirm password"placeholder="Confirm password"/>

        </div>
<Buttond label={"Next"}/>
    </div>
</div>
    </div>
  );
}

export default Register;