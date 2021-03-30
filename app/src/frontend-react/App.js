import 'antd/dist/antd.css';

import React from 'react';

import {Layout, Menu} from 'antd'


import MainPage from "./MainPage";
import StatisticsPage from "./StatisticsPage";


const {Header, Content} = Layout;




class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'main'
        }
    }


    handleClick = (e) => {
        console.log('click', e)
        this.setState({
            current: e.key
        })
    }

    render() {
        let content;

        if (this.state.current === 'main') {
            content = <MainPage />
        } else {
            content = <StatisticsPage />
        }

        return (
            <Layout>
                <Header style={{background: '#FFF'}}>
                    <Menu
                        onClick={this.handleClick}
                        defaultSelectedKeys={['main']}
                        selectedKeys={this.state.current}
                        mode='horizontal'
                        theme='light'>
                            <Menu.Item key='main' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                Главная
                            </Menu.Item>
                            <Menu.Item key='stats' style={{fontSize: '20px', fontWeight: 'bold'}}>
                                Пациенты
                            </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    {content}
                </Content>
            </Layout>
        )
    }
}

export default App