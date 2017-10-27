import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from 'quickcommerce-react/components/AuthenticatedComponent.jsx'
import OrderListComponent from 'quickcommerce-react/components/OrderListComponent.jsx'

export default AuthenticatedComponent(class OrderListPage extends Component {
    render() {       
        return (
            <OrderListComponent
				{...this.props}
				/>
        )
    }
})