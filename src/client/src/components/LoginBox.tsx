const LoginBox: React.FunctionComponent = () => {
    return (
        <>
            <div>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email" required/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required/>
            </div>
        </>
    );
}

export default LoginBox;