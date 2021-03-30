import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      testFolder: undefined
    }
  }

  async componentDidMount() {
      let tf = await window.backend.readLocal('tests-folder')
      if (!tf) {
          tf = (await window.backend.selectFolder()).filePaths
          await window.backend.writeLocal('tests-folder', tf)
      }
      console.log(`tf is ${tf}`)
      this.setState({
          testFolder: tf
      })
  }

  async reselectFolder () {
      let {filePaths} = await window.backend.selectFolder()
      await window.backend.writeLocal('tests-folder', filePaths)
      this.setState({
          testFolder: filePaths
      })
  }

  render() {
    return (
        <div className="App">
          <div className="TestsFolderAddress">
            {this.state.testFolder}
          </div>
          <button onClick={() => this.reselectFolder()}>
              Reselect folder
          </button>
        </div>
    )
  }

}

export default App;
