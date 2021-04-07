import React from "react";

import {Typography, Button, Divider} from "antd";

const {Text} = Typography;

class SettingsPage extends React.Component {
    render() {
        return (
            <div>
                <Text type={this.props.tfolder.status === 'ok' ? 'success' : 'danger'}>
                    {this.props.tfolder.status === 'ok'
                        ? this.props.tfolder.path : 'Папка с тестами не найдена :('}
                </Text>
                <Divider />
                <Button onClick={this.props.tfolderReloader}>
                    загрузить папку с тестами
                </Button>
            </div>
        )
    }
}

export default SettingsPage;