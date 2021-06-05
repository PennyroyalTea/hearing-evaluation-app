import React from "react";

import {
    Table,
    Spin,
    Divider,
    Button,
    Space,
    Row,
    Col
} from 'antd'

const { Column, ColumnGroup } = Table

const ATTEMPTS_SHOW_LIMIT = 1000;

export default class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        }
    }

    _formatDate(date) {
        const _leadingZero = x => (x < 10 ? '0' + x : x);
        const hrs = _leadingZero(date.getHours());
        const mins = _leadingZero(date.getMinutes());
        const day = _leadingZero(date.getDate());
        const month = _leadingZero(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}.${month}.${year} ${hrs}:${mins}`;
    }

    async componentDidMount() {
        let attempts = await window.backend.getNAttempts(ATTEMPTS_SHOW_LIMIT, this.props.currentUserId);
        attempts = attempts.map(async (attempt) => {
            const user = await window.backend.getUserById(attempt.userId);
            attempt['name'] = user.name;
            attempt['surname'] = user.surname;
            attempt['patronal'] = user.patronal;
            attempt['time'] = this._formatDate(new Date(attempt.ts));
            attempt['result'] = `${attempt['succ']} / ${attempt['all']} (${(100 * attempt['succ'] / attempt['all']).toFixed(1)} %)`;
            attempt['thresholdPass'] = (attempt['threshold'] ? (attempt['succ'] >= attempt['threshold'] ? '+' : '-') : '?');
            attempt['avgSpeed'] = `${(attempt['averageSpeed'] / 1000)?.toFixed(2)} сек.`;
            return attempt;
        });
        attempts = await Promise.all(attempts);
        attempts.sort((l, r)=>(r['ts'] - l['ts']));
        this.setState({
            data: attempts
        })
    }

    render() {
        if (!this.state.data) {
            return (<Spin delay={100}/>);
        }

        return (
            <Space direction='vertical' style={{width: '100%'}}>
                <Row justify='center' gutter={16}>
                    <Col>
                        <Button size='large'
                                disabled={!this.props.currentUserId}
                                onClick={async ()=> await window.backend.saveAttemptsAsCSV(this.props.currentUserId)}>
                            Отчет по текущему
                        </Button>
                    </Col>
                    <Col>
                        <Button size='large' onClick={async ()=> await window.backend.saveAttemptsAsCSV()}>
                            Отчет по всем
                        </Button>
                    </Col>
                </Row>
                <Divider/>
                <Table dataSource={this.state.data} rowKey={(row)=>row.id}>
                    <ColumnGroup title='Пациент'>
                        <Column title='Фамилия' dataIndex='surname' key='surname' />
                        <Column title='Имя' dataIndex='name' key='name' />
                        <Column title='Отчество' dataIndex='patronal' key='patronal' />
                    </ColumnGroup>
                    <ColumnGroup title='Тест'>
                        <Column title='название' dataIndex='testId' key='tid' />
                        <Column title='результат' dataIndex='result' key='result' />
                        <Column title='порог пройден' dataIndex='thresholdPass' key='thresholdPass' />
                        <Column title='среднее время' dataIndex='avgSpeed' key='avgSpeed' />
                    </ColumnGroup>
                    <Column title='дата' dataIndex='time' key='time' />
                </Table>
            </Space>
        )
    }
}