/**
 * This file is a wrapper that allows for isomorphic rendering of the application, and is also the main entry point for webpack.
 * You can include any MainComponent. Here, we're including the QuickCommerce app itself.
 */
if (!global.setTimeout) {
    global.setTimeout = function() {}
}

if (!global.setInterval) {
    global.setInterval = function() {}
}

import React from 'react'
import ReactDOM from 'react-dom'
import {renderToString} from 'react-dom/server'

import {inject, observer, Provider} from 'mobx-react'

// Start App imports
import AppDispatcher from 'quickcommerce-react/dispatcher/AppDispatcher.jsx'
import AuthenticatedApp from 'quickcommerce-react/components/AuthenticatedApp.jsx'

import LoginActions from 'quickcommerce-react/actions/LoginActions.jsx'
import UserActions from 'quickcommerce-react/actions/UserActions.jsx'
import CustomerActions from 'quickcommerce-react/actions/CustomerActions.jsx'
import CustomerListActions from 'quickcommerce-react/actions/CustomerListActions.jsx'
import CustomerSearchActions from 'quickcommerce-react/actions/CustomerSearchActions.jsx'
//import OmniSearchActions from 'quickcommerce-react/actions/OmniSearchActions.jsx'
import CheckoutActions from 'quickcommerce-react/actions/CheckoutActions.jsx'
import ProductActions from 'quickcommerce-react/actions/ProductActions.jsx'
import SettingActions from 'quickcommerce-react/actions/SettingActions.jsx'

import AuthService from 'quickcommerce-react/services/AuthService.jsx'
import UserService from 'quickcommerce-react/services/UserService.jsx'
//import LoginService from 'quickcommerce-react/services/LoginService.jsx'
import CustomerService from 'quickcommerce-react/services/CustomerService.jsx'
import CustomerAddressService from 'quickcommerce-react/services/CustomerAddressService.jsx'
import CheckoutService from 'quickcommerce-react/services/CheckoutService.jsx'

import { LoginStore } from 'quickcommerce-react/stores/LoginStore.jsx'
import { UserStore } from 'quickcommerce-react/stores/UserStore.jsx'
import { CustomerStore } from 'quickcommerce-react/stores/CustomerStore.jsx'
import { CustomerListStore } from 'quickcommerce-react/stores/CustomerListStore.jsx'
import { ProductStore } from 'quickcommerce-react/stores/ProductStore.jsx'
import { CheckoutStore } from 'quickcommerce-react/stores/CheckoutStore.jsx'
import { SettingStore } from 'quickcommerce-react/stores/SettingStore.jsx'
import { StarMicronicsStore } from 'quickcommerce-react/stores/StarMicronicsStore.jsx'

const dispatcher = AppDispatcher

// Initialize stores
const loginStore = new LoginStore(dispatcher)
const userStore = new UserStore(dispatcher)
const customerStore = new CustomerStore(dispatcher)
const customerListStore = new CustomerListStore(dispatcher)
const productStore = new ProductStore(dispatcher)
const checkoutStore = new CheckoutStore(dispatcher)
const settingStore = new SettingStore(dispatcher)
const starMicronicsStore = new StarMicronicsStore(dispatcher)

import FluxHelper from 'quickcommerce-react/helpers/Flux.js'
import HashProxy from 'quickcommerce-react/utils/HashProxy.js'
//FluxHelper.bindActionCreators()

const actionRegistry = new HashProxy()

let actionCreators = [
    { key: 'user', value: UserActions },
    { key: 'login', value: LoginActions },
    { key: 'customer', value: CustomerActions },
    { key: 'customerList', value: CustomerListActions },
    //{ key: 'customerSearch', value: CustomerSearchActions },
    //{ key: 'omniSearch', value: OmniSearchActions },
    { key: 'product', value: ProductActions },
    { key: 'checkout', value: CheckoutActions },
    { key: 'setting', value: SettingActions }
]

function registerActions(registry, dispatcher, actionCreators) {	 
	if (!actionCreators instanceof Array) {
		throw new Error('registerActions expects an array of actionCreators')
	}
	
	return actionCreators.reduce((registry, obj) => {
		const action = obj.value(dispatcher)
		registry[obj.key] = action
		return registry
	}, registry)
}

registerActions(actionRegistry, dispatcher, actionCreators)

const authService = new AuthService({ 
    actions: actionRegistry, 
    stores: {} 
})

const userService = new UserService({ 
    actions: actionRegistry,
    stores: {}
})

const customerService = new CustomerService({ 
    actions: actionRegistry,
    stores: {
        customer: customerStore
    }
})

const customerAddressService = new CustomerAddressService({ 
    actions: actionRegistry,
    stores: {}
})

const checkoutService = new CheckoutService({ 
    actions: actionRegistry,
    stores: {
        checkout: checkoutStore,
        setting: settingStore
    }
})

import MainComponent from './QC.jsx'

if ('undefined' !== typeof document) {
    ReactDOM.render(
        <Provider 
            dispatcher = {dispatcher}
            actions = {actionRegistry}
            authService = {authService}
            customerService = {customerService}
            customerAddressService = {customerAddressService}
            checkoutService = {checkoutService}
            userStore = {userStore}
            loginStore = {loginStore}
            customerStore = {customerStore}
            customerListStore = {customerListStore}
            productStore = {productStore}
            checkoutStore = {checkoutStore}
            settingStore = {settingStore}
            starMicronicsStore = {starMicronicsStore}>
            <AuthenticatedApp>
                <MainComponent />
            </AuthenticatedApp>
        </Provider>,
        document.getElementById('main')
    )
} else {
    print(renderToString(<MainComponent />))
}