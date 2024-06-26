import 'antd/dist/antd.css';

import React from 'react';

import {Layout,
    Space,
    Menu,
    Empty
} from 'antd'


import MainPage from "./MainPage";
import PatientsPage from "./PatientsPage";
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
            },
            currentUser: undefined // user id
        }
    }

    async componentDidMount() {
        await this.initFolder();
    }

    async selectUser(userId) {
        const user = await window.backend.getUserById(userId)
        this.setState({
            currentUser: user
        })
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
                content = <MainPage tfolder={this.state.tfolder} currentUser={this.state.currentUser}/>
                break;
            case 'patients':
                content = (
                    <PatientsPage
                        userChooser={(userId) => this.selectUser(userId)}
                        currentUser={this.state.currentUser}
                        />)
                break;
            case 'stats':
                content = <StatisticsPage currentUserId={this.state.currentUser?.id}/>
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
                                    Тестирование
                                </Menu.Item>
                                <Menu.Item key='patients' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                    Пациенты
                                </Menu.Item>
                                <Menu.Item key='stats' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                    Статистика
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