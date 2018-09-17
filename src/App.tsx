import * as React from 'react'
import firebaseClient from './firebaseClient'

type Props = {}

type MessageData = {
  author: string
  content: string
  createdAt?: firebaseClient.firestore.Timestamp
}

type Message = {
  id: string
  data: MessageData
}

type State = {
  author: string
  content: string
  messages: Message[]
}

class App extends React.Component<Props, State> {
  private unsubscribe: () => void
  constructor(props: Props) {
    super(props)
    this.state = {
      author: '',
      content: '',
      messages: [],
    }
  }
  public componentDidMount() {
    this.unsubscribe = firebaseClient
      .firestore()
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot(querySnapshot => {
        const messages: Message[] = []
        querySnapshot.forEach(documentSnapshot => messages.push({
          data: documentSnapshot.data() as MessageData,
          id: documentSnapshot.id,
        }))
        this.setState({ messages })
      })
  }
  public componentWillUnmount() {
    this.unsubscribe()
  }
  public render() {
    return (
      <div>
        <h1>Board</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <label htmlFor="author">Author</label>:
            <input
              id="author"
              onChange={this.onChangeAuthor}
              value={this.state.author}
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>:
            <input
              id="content"
              onChange={this.onChangeContent}
              value={this.state.content}
            />
          </div>
          <div>
            <input
              type="submit"
              value="Submit"
            />
          </div>
        </form>
        <ol reversed={true}>
          {this.state.messages.map(message => {
            const messageData = message.data
            const createdAtDateString = messageData.createdAt ? messageData.createdAt.toDate().toLocaleString() : ''
            return (
              <li key={message.id}>
                <dl>
                  <dt>{messageData.author}@{createdAtDateString}</dt>
                  <dt>{messageData.content}</dt>
                </dl>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
  private onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const { author, content } = this.state
    firebaseClient.firestore().collection('messages').add({
      author,
      content,
      createdAt: firebaseClient.firestore.FieldValue.serverTimestamp(),
    })
    this.setState({ content: '' })
  }
  private onChangeAuthor = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ author: event.target.value })
  }
  private onChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: event.target.value })
  }
}

export default App
