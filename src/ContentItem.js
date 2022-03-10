function ContentItem({ content, style }) {
  console.log(content)
  return (
    <div className="ContentItem" style={style}>
      {/* <img src={'images/' + content.image} alt="" /> */}
      <img src={content.image} alt="" />
    </div>
  )
}

export default ContentItem
