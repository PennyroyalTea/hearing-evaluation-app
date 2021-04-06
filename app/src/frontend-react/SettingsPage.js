import React from "react";

import {Typography, Button} from "antd";

const {Text} = Typography;

class SettingsPage extends React.Component {
    render() {
        return (
            <div>
                <Text type={this.props.tfolderSucc ? 'success':'danger'}>
                    {this.props.tfolderSucc
                        ? this.props.tfolder : 'Папка с тестами не найдена :('}
                </Text>
                <Button onClick={this.props.tfolderReloader}>
                    загрузить папку с тестами
                </Button>
            </div>
        )
    }
}

export default SettingsPage;