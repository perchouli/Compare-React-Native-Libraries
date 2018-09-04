import React from 'react';
import { Container, Content, Card, CardItem, Text, Button, Icon, Left, Body, Item, Input, H2, Footer, FooterTab, Form } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import { Image, WebView, Button as RNButton } from 'react-native';

class HomeScreen extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  static navigationOptions ({ navigation }) {
    return {
      headerTitle: 'Posts',
      headerRight: (
        <RNButton
          onPress={() => navigation.navigate('Login')}
          title="Login"
        />
      )
    };
  }

  componentDidMount () {
    fetch('https://dmyz.org/wp-json/wp/v2/posts?categories=79').then(r => r.json()).then(posts => this.setState({ posts }));
  }

  render () {
    return (
      <Container>
        <Content>
          {this.state.posts.map(post => (
            <Card key={post.id}>
              <CardItem>
                <Body>
                  <Image source={{ uri: 'https://picsum.photos/320/480/?random' }} style={{ height: 200, width: 340 }} />
                  <Text>{post.title.rendered}</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent onPress={() => this.props.navigation.navigate('Post', { postId: post.id })}>
                    <Icon active name="arrow-forward" />
                    <Text>Read More</Text>
                  </Button>
                </Left>
              </CardItem>
            </Card>
          ))}
        </Content>

      </Container>
    );
  }
}

class PostScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      post: null
    };
  }

  componentDidMount () {
    const postId = this.props.navigation.getParam('postId');
    if (postId) {
      fetch(`https://dmyz.org/wp-json/wp/v2/posts/${postId}`).then(r => r.json()).then(post => this.setState({ post }));
    }
  }

  render () {
    const post = this.state.post;
    if (!post) {
      return <Container />;
    }
    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1 }}>
          <H2>{post.title.rendered}</H2>
          <WebView source={{ html: post.content.rendered }} style={{
            alignSelf: 'stretch',
            height: 400
          }} scalesPageToFit = {false} />
        </Content>
      </Container>
    );
  }
}

class LoginScreen extends React.Component {
  render () {
    return (
      <Content>
        <Form>
          <Item>
            <Input placeholder="Username or email" />
          </Item>
          <Item last>
            <Input placeholder="Password" />
          </Item>
          <Button block>
            <Text>LOGIN</Text>
          </Button>
        </Form>
      </Content>

    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Post: PostScreen,
    Login: LoginScreen
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends React.Component {
  render () {
    return <RootStack />;
  }
}
