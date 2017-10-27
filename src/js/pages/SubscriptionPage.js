import assign from 'object-assign'

import React, { Component } from 'react'

import Box from 'grommet/components/Box'
import Section from 'grommet/components/Section'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import ProductBrowser from 'quickcommerce-react/components/browser/ProductBrowser.jsx'
import SubscriptionBrowser from 'quickcommerce-react/components/browser/SubscriptionBrowser.jsx'
import CatalogRow from 'quickcommerce-react/components/catalog/CatalogRow.jsx'
import SignIn from 'quickcommerce-react/components/account/SignIn.jsx'

export default class SubscriptionPage extends Component {
    
    constructor(props) {
        super(props)
        
        this.showBillingAddressModal = this.showBillingAddressModal.bind(this)
        this.hideBillingAddressModal = this.hideBillingAddressModal.bind(this)
        this.showShippingAddressModal = this.showShippingAddressModal.bind(this)
        this.hideShippingAddressModal = this.hideShippingAddressModal.bind(this)
        
        this.getInitialState = this.getInitialState.bind(this)
        let state = this.getInitialState(SampleItems)
        
        this.state = state
        console.log('state data')
        console.log(this.state)
    }
    
    getInitialState(items = []) {
        let state = {}
        
        let data = []
        for (var key in items) {
            let item = items[key]
            if (item.thumbnail) {
                item.id = key
                data.push(item)
            }
        }
        
        state = assign({}, state, { data: data })
        
        return state
    }
    
    showBillingAddressModal() {
        this.setState({billingAddress: 1})
    }
    hideBillingAddressModal() {
        this.setState({billingAddress: null})
    }
    showShippingAddressModal() {
        this.setState({shippingAddress: 1})
    }
    hideShippingAddressModal() {
        this.setState({shippingAddress: null})
    }
    render() {
        return (
          <Box>
            <Section>
                <Row>
                    <Col sm={3}>
                        <SignIn />
                    </Col>
                    <Col sm={9}>
                        <SubscriptionBrowser 
                            customRowComponent = {CatalogRow}
                            results = {this.state.data}
                            />
                    </Col>
                </Row>
            </Section>
          </Box>
        );
    }
};