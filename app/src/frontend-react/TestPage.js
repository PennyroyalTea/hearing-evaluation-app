import React from "react";
import {Progress, message, Image, Typography, List, Button, Col, Row} from "antd";

const path = require('path');

const {Title} = Typography;

export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: props.testFile,
            testEnder: props.testEnder,
            questionId: 0,
            correctAnswers: 0,
            ended: false
        }
    }

    handleImageClick(image) {
        if (!this.props.config.settings.multipleAnswers) {
            this.setState({
                [`img_${image}`]: true
            }, ()=>{
                this.handleNextClick();
            })
            return;
        }

        if (this.state[`img_${image}`]) {
            this.setState({
                [`img_${image}`]: false
            })
        } else {
            this.setState({
                [`img_${image}`]: true
            })
        }

    }


    handleNextClick() {
        let correct = true;
        for (let answer of this.props.config.questions[this.state.questionId].answers) {
            let isSelected = this.state[`img_${answer.image}`] || false
            if (isSelected !== answer.correct) {
                correct = false;
                break;
            }
        }

        let erasedSelections = {}
        for (let answer of this.props.config.questions[this.state.questionId].answers) {
            erasedSelections[`img_${answer.image}`] = undefined
        }

        this.setState(erasedSelections)

        if (correct) {
            this.setState({
                correctAnswers: this.state.correctAnswers + 1
            })
        }

        if (this.props.testMode === 'practice') {
            if (correct) {
                message.success('Правильно!', 2)
            } else {
                message.error('Неправильно :(', 2)
            }
        } else {
            message.warn('Ответ принят!', 2)
        }

        const questionsTotal = this.props.config.questions.length
        if (this.state.questionId + 1 === questionsTotal) {
            this.setState({
                ended: true
            })
        } else {
            this.setState({
                questionId: this.state.questionId + 1
            })
        }
    }

    handleReturnClick() {
        this.state.testEnder({
            userId: 'admin',
            testId: 'THE-test',
            succ: this.state.correctAnswers,
            all: this.props.config.questions.length,
            ts: Date.now()
        })
    }

    renderAnswer(answer) {
        const isSelected = this.state[`img_${answer.image}`];

        return (<List.Item>
            <Image
                preview={false}
                src={path.join('file://', this.props.testPath, 'images', answer.image)}
                onClick={()=>this.handleImageClick(answer.image)}
                style={{border: isSelected ? 'solid' : ''}}
            />
        </List.Item>)
    }

    render() {
        const qId = this.state.questionId;

        if (this.state.ended) {
            return (
                <div align='center'>
                    <Title>
                        Конец теста! Правильных ответов: {this.state.correctAnswers} из {this.props.config.questions.length}
                    </Title>
                    <Progress
                        type='circle'
                        strokeColor='green'
                        percent={Math.round(100 * this.state.correctAnswers / this.props.config.questions.length)}
                    />
                    <Button
                        onClick={()=>this.handleReturnClick()}
                    >
                        Вернуться в меню
                    </Button>
                </div>
            )
        }

        return (
            <Row>
                <Col span={24} align={'center'}>
                    <p>
                        Режим: {this.props.testMode === 'practice' ? 'тренировка' : 'тестирование'}
                    </p>
                    <p>
                        Вопрос {qId + 1} / {this.props.config.questions.length}
                    </p>
                    <br/>
                    {
                        this.props.config.settings.multipleAnswers ? (
                            <Button
                                onClick={()=>this.handleNextClick()}
                            >
                                Ответить
                            </Button>
                        ) : ''
                    }
                    <br/>
                    <audio
                        controls
                        src={path.join('file://', this.props.testPath, 'sounds', this.props.config.questions[qId].sound)}
                    />
                    <List
                        grid={{gutter:16, column: 4}}
                        dataSource={this.props.config.questions[qId].answers}
                        renderItem={(answer)=>this.renderAnswer(answer)}
                    />
                </Col>
            </Row>

        )
    }
}