import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from 'quickcommerce-react/components/AuthenticatedComponent.jsx'
import SettingComponent from 'quickcommerce-react/components/SettingComponent.jsx'

export default AuthenticatedComponent(class SettingPage extends Component {
    render() {       
        return (
            <SettingComponent
                {...this.props}
                />
        )
    }
})