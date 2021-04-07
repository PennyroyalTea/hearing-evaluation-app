import 'antd/dist/antd.css';

import React from 'react';

import {Layout,
    Space,
    Menu,
    Empty
} from 'antd'


import MainPage from "./MainPage";
import StatisticsPage from "./StatisticsPage";
import SettingsPage from "./SettingsPage";

const {Header, Content} = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'main', // main | stats | settings
            tfolder: {
                status: 'loading', // loading | error | ok
                path: undefined
            }
        }
    }

    async componentDidMount() {
        await this.initFolder();
    }

    async selectFolder() {
        const {canceled, filePaths} = await window.backend.selectFolder()
        if (canceled) {
            if (this.state.tfolder.status !== 'ok') {
                this.setState({
                    tfolder: {
                        status: 'error',
                        path: undefined
                    }
                })
            }
            return
        }
        const path = filePaths[0]
        await window.backend.writeLocal('tfolder', path)
        this.setState({
            tfolder: {
                status: 'ok',
                path: path
            }
        })
    }

    async initFolder() {
        let path = await window.backend.readLocal('tfolder')
        if (path) {
            this.setState({
                tfolder: {
                    status: 'ok',
                    path: path
                }
            })
        } else {
            await this.selectFolder()
        }
    }

    handleMenuClick = e => {
        this.setState({
            page: e.key,
        })
    }

    render() {
        let content;
        switch (this.state.page) {
            case 'main':
                content = <MainPage tfolder={this.state.tfolder}/>
                break;
            case 'stats':
                content = <StatisticsPage/>
                break;
            case 'settings':
                content = (<SettingsPage
                    tfolder={this.state.tfolder}
                    tfolderReloader={() => this.selectFolder()}
                />);
                break;
            default:
                content = <Empty/>
        }



        return (
            <Layout style={{background: '#fff'}} size='large'>
                <Space direction='vertical'>
                    <Header>
                        <Menu
                            onClick={(e) => this.handleMenuClick(e)}
                            defaultSelectedKeys={['main']}
                            selectedKeys={[this.state.page]}
                            mode='horizontal'
                            theme='dark'>
                                <Menu.Item key='main' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                        Главная
                                </Menu.Item>
                                <Menu.Item key='stats' style={{fontSize: '20px', fontWeight: 'bold'}} disabled>
                                    Пациенты
                                </Menu.Item>
                                <Menu.Item key='settings' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                    Настройки
                                </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{background: '#fff'}}>
                        {content}
                    </Content>
                </Space>
            </Layout>
        )
    }
}

export default App