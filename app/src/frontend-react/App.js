import 'antd/dist/antd.css';

import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {Layout,
    Space,
    Menu
} from 'antd'


import MainPage from "./MainPage";
import StatisticsPage from "./StatisticsPage";

const {Header, Content} = Layout;

class App extends React.Component {

    render() {
        return (
            <Router>
                <Layout style={{background: '#fff'}} size='large'>
                    <Space direction='vertical'>
                        <Header>
                            <Menu
                                defaultSelectedKeys={['main']}
                                mode='horizontal'
                                theme='dark'>
                                    <Menu.Item key='main' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                        <Link to='/'>
                                            Главная
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key='stats' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                        <Link to='/stats'>
                                            Пациенты
                                        </Link>
                                    </Menu.Item>
                            </Menu>
                        </Header>

                        <Content style={{background: '#fff'}}>
                            <Switch>
                                <Route path='/stats'>
                                    <StatisticsPage/>
                                </Route>
                                <Route path='/'>
                                    <MainPage/>
                                </Route>
                            </Switch>
                        </Content>
                    </Space>
                </Layout>
            </Router>
        )
    }
}

export default App