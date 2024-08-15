const RegisterBox: React.FunctionComponent = () => {
    return (
        <>
            <div>
                <label htmlFor="nickName">Display Name</label>
                <input placeholder="Some display name" id="nickName" type="text" name="nickName" required/>
            </div>
            <div>
                <label htmlFor="name">Username</label>
                <input placeholder="Some username" id="name" type="text" name="name" required/>
            </div>
            <div>
                <label htmlFor="email">Email Address</label>
                <input placeholder="example@domain.com" id="email" type="email" name="email" required/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required/>
            </div>
        </>
    );
}

export default RegisterBox;