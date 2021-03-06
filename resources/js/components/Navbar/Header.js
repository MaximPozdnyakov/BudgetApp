import React from "react";

import { Navbar, Nav, Dropdown } from "react-bootstrap";

import { NavLink, Link } from "react-router-dom";

import { If, Then, Else } from "react-if";
import { connect } from "react-redux";
import userActions from "../../actions/users";
import { selectWallet } from "../../actions/wallets";

function Header(props) {
    const {
        isUserAuthenticated,
        logout,
        username,
        logoutGoogle,
        isGoogleUser,
        selectedWallet,
        wallets,
        selectWallet
    } = props;

    const logoutHandler = () => {
        if (isGoogleUser) {
            logoutGoogle();
        } else {
            logout();
        }
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div
            className="h-100 d-flex align-items-center"
            style={{ cursor: "pointer" }}
        >
            <a
                className="font-weight-bold text-dark"
                ref={ref}
                onClick={e => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                {children}
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </a>
        </div>
    ));

    const dropdownWallets = wallets.map(wallet => {
        if (wallet.id != selectedWallet.id) {
            return (
                <Dropdown.Item
                    key={wallet.id}
                    onClick={() => selectWallet(wallet)}
                >
                    {wallet.title}
                </Dropdown.Item>
            );
        }
    });

    return (
        <If
            condition={
                isUserAuthenticated && Object.keys(selectedWallet).length !== 0
            }
        >
            <Then>
                <Navbar className="border-bottom px-3 px-md-5  mb-3 mb-md-5 bg-white">
                    <div className="d-flex justify-content-between w-100">
                        <Dropdown
                            className="align-content-center"
                            navbar={true}
                        >
                            <Dropdown.Toggle as={CustomToggle}>
                                <Navbar.Brand className="font-weight-bold text-dark mr-1">
                                    {selectedWallet.title}
                                </Navbar.Brand>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {dropdownWallets}
                                <Dropdown.Item as="div">
                                    <NavLink
                                        to="/wallet/create"
                                        className="text-success"
                                    >
                                        Create new wallet
                                    </NavLink>
                                </Dropdown.Item>
                                <Dropdown.Divider className="d-flex d-sm-none" />
                                <Dropdown.Item
                                    as="div"
                                    className="d-flex d-sm-none"
                                >
                                    {username}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="text-danger d-flex d-sm-none"
                                    onClick={logoutHandler}
                                >
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Nav className="align-content-center mt-2 top-center-links">
                            <Nav.Item className="mr-3">
                                <NavLink
                                    exact
                                    to="/operations"
                                    activeClassName="link-success"
                                >
                                    Operations
                                </NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                <NavLink
                                    exact
                                    to="/overview"
                                    activeClassName="link-success"
                                >
                                    Overview
                                </NavLink>
                            </Nav.Item>
                        </Nav>
                        <Dropdown
                            className="align-content-center d-none d-sm-flex"
                            navbar={true}
                            alignRight={true}
                        >
                            <Dropdown.Toggle as={CustomToggle}>
                                {username}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    className="text-danger"
                                    onClick={logoutHandler}
                                >
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar>
            </Then>
            <Else>
                <Navbar className="border-bottom px-5 mb-5 bg-white">
                    <div className="d-flex justify-content-center w-100">
                        <Link to="/">
                            <Navbar.Brand className="font-weight-bold text-dark align-content-center">
                                Budget App
                            </Navbar.Brand>
                        </Link>
                    </div>
                </Navbar>
            </Else>
        </If>
    );
}

const mapStateToProps = state => ({
    username: state.users.user.name,
    isGoogleUser: state.users.user.isGoogleUser,
    isUserAuthenticated: state.users.isUserAuthenticated,
    selectedWallet: state.wallets.currentWallet,
    wallets: state.wallets.wallets
});

export default connect(mapStateToProps, {
    logout: userActions.logout,
    logoutGoogle: userActions.logoutGoogle,
    selectWallet
})(Header);
