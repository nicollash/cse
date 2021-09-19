export type QuestionReplies = {
  id?: string
  QuestionSourceMDA?: string
  QuestionReply?: Array<QuestionReply>
}

type QuestionReply = {
  id?: string
  Name?: string
  VisibleInd?: string
  Value?: string
}
