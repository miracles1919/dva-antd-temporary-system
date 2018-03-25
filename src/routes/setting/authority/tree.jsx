import { Tree } from 'antd'
import React from 'react'
import { menuTree } from 'utils/menu'

const TreeNode = Tree.TreeNode
const treeData = menuTree

class Demo extends React.Component {
  static propTypes={
    checkedKeys: React.PropTypes.array,
    onSelectTree: React.PropTypes.func,
    onlyForShow: React.PropTypes.bool,
  }

  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: this.props.checkedKeys,
    selectedKeys: [],
  }
  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps')
    this.setState({
      checkedKeys: nextProps.checkedKeys,
    })
  }
  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys)
    if (!this.props.onlyForShow) {
      this.props.onSelectTree(checkedKeys)
      this.setState({ checkedKeys })
    }
  }
  onSelect = (selectedKeys) => {
    // console.log('onSelect',selectedKeys)
    this.setState({ selectedKeys })
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }
  render () {
    // console.log('tree',this.state.checkedKeys)
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    )
  }
}

export default Demo
