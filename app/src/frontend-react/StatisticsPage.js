import React from "react";

import {List, Card, Typography, Spin, Table} from 'antd'

import { Line } from '@ant-design/charts';

import {mockUserList, mockDetailedStats} from "./Mock";

const {Title} = Typography;

class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,
            userToShow: undefined
        }
    }

    async componentDidMount() {
        await this.loadUserList()
    }

    async loadUserList() {
        const res = await mockUserList()
        this.setState({
            users: res
        })
    }

    handleCardClick(userId) {
        this.setState({
            userToShow: userId
        })
    }


    renderUser(user) {
        return (<List.Item>
            <Card hoverable onClick={()=>this.handleCardClick(user.userId)}>
                {user.surname}
                <br/>
                {user.name}
                <br/>
                {user.patronal}
            </Card>
        </List.Item>)
    }

    render() {
        if (!this.state.userToShow) {
            return (
                <List
                    grid={{gutter: 16, column: 5}}
                    dataSource={this.state.users}
                    renderItem={user => this.renderUser(user)}
                />
            )
        }

        return <UserStatistics userId={this.state.userToShow}/>
    }
}

class UserStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId,
            stats: undefined,
            columns: [
                {
                    title: 'Время',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: 'Правильных',
                    dataIndex: 'correct',
                    key: 'correct',
                },
                {
                    title: 'Всего',
                    dataIndex: 'total',
                    key: 'total',
                },
            ]
        }
    }

    async componentDidMount() {
        await this.loadDetailedStats()

    }

    async loadDetailedStats() {
        const res = await mockDetailedStats();
        this.setState({
            stats: res,
        })
    }

    render() {
        if (!this.state.stats) {
            return <Spin delay={150}/>
        }

        const config = {
            data: this.state.stats,
            xField: 'ts',
            yField: 'correct',
        };

        return (<div>
            <Title>Статистика пользователя #{this.state.userId}</Title>
            <Line {...config}/>
            <Table dataSource={this.state.stats} columns={this.state.columns}/>
        </div>)
    }
}

export default StatisticsPage;