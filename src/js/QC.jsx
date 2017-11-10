/**
 * The actual QuickCommerce app
 */
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { DragDropContext } from 'react-dnd'
import { HashRouter, Switch, Route } from 'react-router-dom';
import HTML5Backend        from 'react-dnd-html5-backend'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
//import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import { bubble as MainMenu, fallDown as CustomerMenu } from 'react-burger-menu'

import AuthenticatedApp from 'quickcommerce-react/components/AuthenticatedApp.jsx'

import TopMenu from 'quickcommerce-react/components/menu/TopMenu.jsx'
import AccountMenu from 'quickcommerce-react/components/menu/AccountMenu.jsx'

import PosPage from './pages/PosPage'
import SettingPage from './pages/SettingPage'
import AccountPage from './pages/AccountPage'

import LoginActions from 'quickcommerce-react/actions/LoginActions.jsx'
import UserActions from 'quickcommerce-react/actions/UserActions.jsx'

import AuthService from 'quickcommerce-react/services/AuthService.jsx'
import CustomerService from 'quickcommerce-react/services/CustomerService.jsx'
import CustomerAddressService from 'quickcommerce-react/services/CustomerAddressService.jsx'
import CheckoutService from 'quickcommerce-react/services/CheckoutService.jsx'

import LoginStore from 'quickcommerce-react/stores/LoginStore.jsx'
import UserStore from 'quickcommerce-react/stores/UserStore.jsx'
import CustomerStore from 'quickcommerce-react/stores/CustomerStore.jsx'
import CustomerListStore from 'quickcommerce-react/stores/CustomerListStore.jsx'
import ProductStore from 'quickcommerce-react/stores/ProductStore.jsx'
import CheckoutStore from 'quickcommerce-react/stores/CheckoutStore.jsx'
import SettingStore from 'quickcommerce-react/stores/SettingStore.jsx'
import StarMicronicsStore from 'quickcommerce-react/stores/StarMicronicsStore.jsx'

console.log('QC API endpoint: ' + QC_API)

/*try {
    // TODO: Expire!
    let userToken = sessionStorage.getItem('userToken') || false
    if (userToken === false) {
        // This is triggered on the first page load, we don't know if the user is logged in or not
        AuthService.getToken() // Fetch a token and store it for future requests
    } else {
        // Attempt to fetch the account, if the user is logged in we'll store it
        AuthService.fetchAccount()
    }

} catch (err) {
    console.log(err)
}*/

@inject(deps => ({
    actions: deps.actions,
	authService: deps.authService,
	customerService: deps.customerService,
    checkoutService: deps.checkoutService,
    settingService: deps.authService,
	loginStore: deps.loginStore,
    userStore: deps.userStore,
    customerStore: deps.customerStore,
    checkoutStore: deps.checkoutStore,
    starMicronicsStore: deps.starMicronicsStore,
    productStore: deps.productStore,
	settingStore: deps.settingStore,
	mappings: deps.mappings, // Per component or global scope?
	translations: deps.translations, // i8ln transations
	roles: deps.roles, // App level roles, general authenticated user (not customer!)
	userRoles: deps.userRoles, // Shortcut or implement via HoC?
	user: deps.user // Shortcut or implement via HoC?
}))
@observer // Wrapped instance or component I fucking forget fuck this stupid project I want my fucking money already fuck you Joe Parrotino you piece of shit
class QC extends Component {
    constructor(props) {
        super(props)
		
		this.onHashChange = this.onHashChange.bind(this)
		this.renderErrors = this.renderErrors.bind(this)
		this.renderNotifications = this.renderNotifications.bind(this)
		//this.toggleSearch = this.toggleSearch.bind(this)
        
        this.state = {
            errors: [
                'Could not connect to the internet. Please check your internet connection settings.',
                'Could not find mPOP cash drawer. Please check your Bluetooth settings and make sure your cash drawer has been paired.',
                'Could not connect to mPOP cash drawer. Please try restarting your cash drawer or contact your system administrator.'
            ],
            notifications: [
                'There is a new update available. Please click here to download the update.'
            ]
        }
    }

    componentWillMount() {
		window.addEventListener('hashchange', this.onHashChange)
		this.onHashChange()
	}
	
	componentWillUnmount() {
		window.removeEventListener('hashchange', this.onHashChange)
	}
	
	onHashChange() {
		// Force login
		if (!this.state.loggedIn) {
			window.location.hash = '/account/login'
		}

	}
    
    renderErrors() {
        let errors = []
        let count = Object.keys(this.state.errors).length
        let idx = 1
        
        if (typeof this.state.errors !== 'string' && count > 0) {
            for (let error in this.state.errors) {
                errors.push(<span><strong>Error:</strong> <span>{this.state.errors[error]}</span></span>)
                if (idx < count) {
                    errors.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.errors === 'string') {
            errors.push(<span><strong>Error:</strong> <span>{this.state.errors}</span></span>)
        }
        
        return errors
    }
    
    renderNotifications() {
        let notifications = []
        let count = Object.keys(this.state.notifications).length
        let idx = 1
        
        if (typeof this.state.notifications !== 'string' && count > 0) {
            for (let notification in this.state.notifications) {
                notifications.push(<span><strong>Notice:</strong> <span>{this.state.notifications[notification]}</span></span>)
                if (idx < count) {
                    notifications.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.notifications === 'string') {
            notifications.push(<span><strong>Notice:</strong> <span>{this.state.notifications}</span></span>)
        }
        
        return notifications
    }

    render() {
        let { errors, notifications } = this.state
        return (
            <AuthenticatedApp>
                <div id='outer-container'>
                    <main id='page-wrap'>
                        {/*(Object.keys(errors).length > 0 || Object.keys(notifications).length > 0) && (
                        <Col xs={12}>
                            {Object.keys(errors).length > 0 && (
                            <Alert bsStyle='danger' style={{
                                textAlign: 'center',
                                margin: '1rem auto 0'
                            }}>
                            {this.renderErrors()}
                            </Alert>
                            )}
                            
                            {Object.keys(notifications).length > 0 && (
                            <Alert bsStyle='info' style={{
                                textAlign: 'center',
                                margin: '1rem auto 0'
                            }}>
                            {this.renderNotifications()}
                            </Alert>
                            )}
                        </Col>
                        )*/}
                        
                        <Col xs={12}>
                            <HashRouter>
                                <div className='react-app-wrapper'>
                                    <Route path='/' component={PosPage}/>
                                    
                                    <Switch>
                                        <Route path='/account/login' component={AccountPage}/>
                                        <Route path='/account/edit' component={AccountPage}/>
                                        <Route exact path='/settings' component={SettingPage}/>
                                    </Switch>
                                </div>
                            </HashRouter>
                        </Col>
                    </main>
                </div>
            </AuthenticatedApp>
        )
    }
}

module.exports = DragDropContext(HTML5Backend)(QC)