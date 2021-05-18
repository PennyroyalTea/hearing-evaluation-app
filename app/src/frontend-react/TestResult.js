import React from 'react';
import {Button, Typography} from "antd";

const {Title} = Typography;

function TestResult(props) {
    return (
        <div align='center'>
            <Title>
                Конец {props.testMode === 'exam' ? 'теста' : 'обучения'}!
            </Title>
            <Title>Правильных ответов: {props.correctAnswers} из {props.config.questions.length} ({(100 * props.correctAnswers / props.config.questions.length).toFixed(1)} %)
            </Title>
            <Button
                onClick={()=>props.handleReturnClick()}
            >
                Вернуться в меню
            </Button>
        </div>
    )
}

export default TestResult;