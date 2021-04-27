import React from "react";

import {Typography, Button, Divider} from "antd";

const {Text, Title} = Typography;

class SettingsPage extends React.Component {
    version = '1.0.4'

    render() {
        return (
            <>
                <Text type={this.props.tfolder.status === 'ok' ? 'success' : 'danger'}>
                    {this.props.tfolder.status === 'ok'
                        ? this.props.tfolder.path : 'Папка с тестами не найдена :('}
                </Text>
                <Divider />
                <Button onClick={this.props.tfolderReloader}>
                    загрузить папку с тестами
                </Button>
                <Divider />
                <Title level={5} align={'center'}>
                    Версия {this.version}
                </Title>
            </>
        )
    }
}

export default SettingsPage;