import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

const CURRENCY = [
    { name: 'ONE HUNDRED', value: 100.00},
    { name: 'TWENTY', value: 20.00},
    { name: 'TEN', value: 10.00},
    { name: 'FIVE', value: 5.00},
    { name: 'ONE', value: 1.00},
    { name: 'QUARTER', value: 0.25},
    { name: 'DIME', value: 0.10},
    { name: 'NICKEL', value: 0.05},
    { name: 'PENNY', value: 0.01}
]

const CASH_IN_DRAWER = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.10],
    ['QUARTER', 4.25],
    ['ONE', 90.00],
    ['FIVE', 55.00],
    ['TEN', 20.00],
    ['TWENTY', 60.00],
    ['ONE HUNDRED', 100.00]
]

export default class ChargeModal extends Component {
	constructor(props) {
        super(props)
        
        this.showChargeModal = this.showChargeModal.bind(this)
        this.hideChargeModal = this.hideChargeModal.bind(this)
        this.renderCashOptions = this.renderCashOptions.bind(this)
        this.renderPaymentOptions = this.renderPaymentOptions.bind(this)
        this.selectPaymentMethod = this.selectPaymentMethod.bind(this)
        this.selectChangePreset = this.selectChangePreset.bind(this)
        
        this.state = { 
            charge: null,
            checkout: {
                system: {
                    currency: CURRENCY,
                    drawer: CASH_IN_DRAWER
                },
                store: SettingStore.getStoreData(),
                order: CheckoutStore.getOrderDetails(),
                items: CartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                totals: CheckoutStore.getTotals(),
                total: CheckoutStore.getTotal()
            }
        }
    }
    
    showChargeModal() {
        this.setState({ 
            charge: 1,
            checkout: {
                system: {
                    currency: CURRENCY,
                    drawer: CASH_IN_DRAWER
                },
                store: SettingStore.getStoreData(),
                order: CheckoutStore.getOrderDetails(),
                items: CartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                totals: CheckoutStore.getTotals(),
                total: CheckoutStore.getTotal()
            }
        })
    }
    
    hideChargeModal() {
        this.setState({ charge: null })
    }
    
    renderPaymentOptions() {
        return (
            <div className='cash-options payment-options'>
                <Button bsStyle='default' data-type='cash' onClick={this.selectPaymentMethod.bind(this, 'cash')}>Cash</Button>&nbsp;
                <Button bsStyle='default' data-type='visa' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Visa</Button>&nbsp;
                <Button bsStyle='default' data-type='mastercard' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Mastercard</Button>&nbsp;
                <Button bsStyle='default' data-type={'debit'} onClick={this.selectPaymentMethod.bind(this, 'debit')}>Debit</Button>&nbsp;
                <Button bsStyle='default' data-type={'cheque'} onClick={this.selectPaymentMethod.bind(this, 'cheque')}>Cheque</Button>&nbsp;
                <Button bsStyle='default' data-type={'giftcard'} onClick={this.selectPaymentMethod.bind(this, 'giftcard')}>Gift Card</Button>
            </div>
        )
    }
    
    renderCashOptions() {
        let total = parseFloat(CheckoutStore.getTotal().value)
        let min = Math.ceil(total/5)*5 // 5 dollars is the lowest bill denomination
        let options = []

        for (let idx = 0; idx < 5; idx++) {
            options.push(min * (idx + 1))
        }

        return (
            <div className='cash-options'>
                <Button bsStyle='success' data-amount={total} onClick={this.selectChangePreset}>${total.toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[0]} onClick={this.selectChangePreset}>${options[0].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[1]} onClick={this.selectChangePreset}>${options[1].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[2]} onClick={this.selectChangePreset}>${options[2].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[3]} onClick={this.selectChangePreset}>${options[3].toFixed(2)}</Button>&nbsp;
                {/*<Button bsStyle='default' data-amount={options[4]} onClick={this.calculateChange}>${options[4].toFixed(2)}</Button>&nbsp;*/}
                <Button bsStyle='disabled' data-amount='custom' onClick={this.toggleCustomPaymentAmount}>Custom</Button>&nbsp;
            </div>
        )
    }
    
    selectChangePreset(e) {
        console.log(e)
        let orderTotal = parseFloat(CheckoutStore.getTotal().value)
        
        let cashAmount = e.target.getAttribute('data-amount')
        
        if (isNaN(cashAmount) && cashAmount === 'custom') {
            if (typeof this.customPaymentAmount !== 'undefined' && 
                this.customPaymentAmount !== null) {
                cashAmount = parseFloat(this.customPaymentAmount.value)
            } else {
                throw new Error('something went wrong with cash amount')
                // TODO: This is a kind of a stupid error message I can handle this better
            }
        } else if (!isNaN(cashAmount)) {
            cashAmount = parseFloat(cashAmount)
        }

        this.setState({
            cashAmount: (cashAmount).toFixed(2),
            changeAmount: (cashAmount - orderTotal).toFixed(2)
        })

        this.completeOrder()
    }
    
    selectPaymentMethod(method) {
        let methods = ['cash', 'credit', 'debit', 'cheque', 'giftcard']
        
        if (methods.indexOf(method) > -1) {
            console.log('changing payment method to ' + StringHelper.capitalizeFirstLetter(method))
            this.setState({
                paymentMethod: StringHelper.capitalizeFirstLetter(method),
                paymentCode: method
            }, () => {
                this.updatePaymentMethod(method, StringHelper.capitalizeFirstLetter(method))
                this.forceUpdate() // Redraw receipt
            })
        } else {
            console.log('clear payment method')
            this.setState({
                paymentMethod: 'In Store',
                paymentCode: 'in_store'
            }, () => {
                this.updatePaymentMethod('in_store', 'In Store')
                this.forceUpdate() // Redraw receipt
            })
        }
    }
    
    render() {
		return (
			<Modal
                show   = {!!this.state.charge}
                onHide = {this.hideChargeModal}>
                <Modal.Header>
                    <Modal.Title>
                        <span style={{ float: 'right', display: 'inline-block', marginTop: '5px' }}>Charge / Split</span>
                        <span style={{ float: 'none' }} class='total-charge'>Total:<span style={{ display: 'inline-block', marginLeft: '1rem', fontSize: '1.5rem' }}>${this.props.orderTotal}</span></span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <div>
                                <Alert bsStyle='danger'>
                                    <i className='fa fa-info' /> Please select a payment option below.
                                </Alert>
                            </div>

                            <form>
                                <FormGroup>
                                    <i className='fa fa-money' /> <ControlLabel>Choose Payment Type</ControlLabel>
                                    <br />
                                </FormGroup>
                                
                                <FormGroup>
                                    {this.renderPaymentOptions()}
                                    <input type='hidden' name='hid_cash' />
                                </FormGroup>

                                <hr />
                                
                                {this.state.paymentCode === 'cash' && (
                                <FormGroup>
                                    {this.renderCashOptions()}
                                    <input type='hidden' name='hid_cash' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cash' && this.state.customPaymentAmount && (
                                <FormGroup>
                                    <i className='fa fa-dollar' /> <ControlLabel>Custom Amount</ControlLabel>
                                    <FormControl type='text' name='custom_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'credit' && (
                                <FormGroup>
                                    <i className='fa fa-credit-card' /> <ControlLabel>Credit Card</ControlLabel>
                                    <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                    <input type='hidden' name='hid_card' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'debit' && (
                                <FormGroup>
                                    <i className='fa fa-credit-card' /> <ControlLabel>Debit Card</ControlLabel>
                                    <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                    <input type='hidden' name='hid_debit' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cheque' && (
                                <FormGroup>
                                    <i className='fa fa-money' /> <ControlLabel>Cheque / Money Order</ControlLabel>
                                    <FormControl type='text' name='cheque' placeholder='Reference Number' />
                                    <input type='hidden' name='hid_cheque' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cheque' && this.customerPaymentAmount && (
                                <FormGroup>
                                    <i className='fa fa-dollar' /> <ControlLabel>Amount</ControlLabel>
                                    <FormControl type='text' name='cheque_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'giftcard' && (
                                <FormGroup>
                                    <i className='fa fa-gift' /> <ControlLabel>Gift Card</ControlLabel>
                                    <FormControl type='text' name='gift' placeholder='Card Number or Swipe' />
                                    <input type='hidden' name='hid_gift' />
                                </FormGroup>
                                )}
                                
                                {/* TODO: Check if is a valid method */}
                                {this.state.paymentCode !== null && (
                                <hr />
                                )}

                                <FormGroup>
                                    <Button bsStyle='success' block onClick={this.completeOrder}><h4><i className='fa fa-money' /> Process Payment</h4></Button>
                                </FormGroup>
                                <FormGroup>
                                    <Button bsStyle='default' block onClick={this.hideChargeModal}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                </FormGroup>
                                
                            </form>
                            
                            <div className='receipt'
                                style={{
                                    margin: '0 auto',
                                    maxWidth: '570px',
                                    boxSizing: 'border-box',
                                    padding: '18px',
                                    border: '1px solid black'
                                }}>
                                {/*this.renderReceipt()*/}
                            </div>
                            
                            <br />
                            
                            <FormGroup>
                                <Button bsStyle='warning' block onClick={this.debugReceipt}>
                                    <h4><i className='fa fa-bug' /> Debug Receipt</h4>
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <Button bsStyle='warning' block onClick={this.debugOrder}>
                                    <h4><i className='fa fa-bug' /> Debug Order</h4>
                                </Button>
                            </FormGroup>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
		)
	}
}