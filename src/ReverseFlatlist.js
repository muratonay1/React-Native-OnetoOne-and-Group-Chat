
/**
 * https://github.com/jevakallio source code was used
 */
import React from 'react';
import { FlatList, View, ScrollView, StyleSheet } from 'react-native';
export default class ReversedList extends React.Component {
  constructor(props) {
    super(props);
    this._previousData = props.data;
    this.state = {
      data: [...props.data].reverse()
    };
  }
  componentWillReceiveProps({ data }) {
    if (data !== this._previousData) {
      this._previousData = data;
      this.setState({ data: [...data].reverse() });
    }
  }
  scrollToBottom() {
    this.scrollToIndex({ index: 0 });
  }
  scrollToIndex(...args) {
    if (this._listViewRef) {
      this._listViewRef.scrollToIndex(...args);
    }
  }
  renderScrollComponent = ({ style, refreshing, ...props }) => (
    <ScrollView style={[style, styles.flip]} {...props} />
  );
  renderItem = props => (
    <View style={styles.flip}>
      {this.props.renderItem(props)}
    </View>
  );
  render() {
    const { renderItem, data, ...props } = this.props;
    return (
      <FlatList
        {...props}
        data={this.state.data}
        renderItem={this.renderItem}
        renderScrollComponent={this.renderScrollComponent}
        ref={ref => (this._listViewRef = ref)}
      />
    );
  }
}
const styles = StyleSheet.create({
  flip: {
    transform: [{ scaleY: -1 }]
  }
});