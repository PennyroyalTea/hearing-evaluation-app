import React from "react";
import {Progress, message, Image, Typography, List, Button, Col, Row} from "antd";

const shuffle = require('shuffle-array');
const path = require('path');

const {Title} = Typography;

export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            config: this.props.config,
            questionId: 0,
            correctAnswers: 0,
            ended: false
        }
    }

    componentDidMount() {
        let needShuffling =
            (this.props.testMode === 'practice' && this.state.config.settings.shuffleTraining) ||
            (this.props.testMode === 'exam' && this.state.config.settings.shuffleTesting);

        if (this.state.config.settings.shareImages) {
        //    generate this.state.config.questions from this.state.config.questionsShared
            console.log(`questionsShared: \n\n ${JSON.stringify(this.state.config.questionsShared)}`)
            let questions = this.state.config.questionsShared.sounds.map((sound, id) => {
                return {
                    sound: sound,
                    answers: this.state.config.questionsShared.images.map(imagePath => {
                        return {
                            image: imagePath,
                            correct: this.state.config.questionsShared.answers[id].includes(path.basename(imagePath))
                        }
                    })
                }
            })
            this.setState({
                config: {...this.state.config, ...{questions: needShuffling ? shuffle(questions) : questions}}
            })
            console.log(`config: \n\n ${JSON.stringify(this.state.config)}`)
        } else {
            if (needShuffling) {
                this.setState({
                    config: {...this.state.config, ...{questions: shuffle(this.state.config.questions)}}
                })
            }
        }

        this.setState({
            loaded: true
        })
    }

    handleImageClick(image) {
        if (!this.state.config.settings.multipleAnswers) {
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
        for (let answer of this.state.config.questions[this.state.questionId].answers) {
            let isSelected = this.state[`img_${answer.image}`] || false
            if (isSelected !== answer.correct) {
                correct = false;
                break;
            }
        }

        let erasedSelections = {}
        for (let answer of this.state.config.questions[this.state.questionId].answers) {
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

        const questionsTotal = this.state.config.questions.length
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
        this.props.testEnder({
            userId: 'admin',
            testId: 'THE-test',
            succ: this.state.correctAnswers,
            all: this.state.config.questions.length,
            ts: Date.now()
        })
    }

    renderAnswer(answer) {
        const isSelected = this.state[`img_${answer.image}`];

        return (<List.Item>
            <Image
                preview={false}
                src={path.join(
                    'file://',
                    this.props.tfolder.path,
                    this.state.config.settings.resourceDir,
                    answer.image)}
                onClick={()=>this.handleImageClick(answer.image)}
                style={{border: isSelected ? 'solid' : ''}}
            />
        </List.Item>)
    }

    render() {
        const qId = this.state.questionId;

        if (!this.state.loaded) {
            return (
                <div>Загрузка</div>
            )
        }

        if (this.state.ended) {
            return (
                <div align='center'>
                    <Title>
                        Конец теста! Правильных ответов: {this.state.correctAnswers} из {this.state.config.questions.length}
                    </Title>
                    <Progress
                        type='circle'
                        strokeColor='green'
                        percent={Math.round(100 * this.state.correctAnswers / this.state.config.questions.length)}
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
                        Вопрос {qId + 1} / {this.state.config.questions.length}
                    </p>
                    <br/>
                    {
                        this.state.config.settings.multipleAnswers ? (
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
                        src={path.join(
                            'file://',
                            this.props.tfolder.path,
                            this.state.config.settings.resourceDir,
                            this.state.config.questions[qId].sound
                        )}
                    />
                    <List
                        grid={{gutter:16, column: 4}}
                        dataSource={this.state.config.questions[qId].answers}
                        renderItem={(answer)=>this.renderAnswer(answer)}
                    />
                </Col>
            </Row>

        )
    }
}