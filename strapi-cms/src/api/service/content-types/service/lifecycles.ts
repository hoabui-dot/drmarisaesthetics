import { validateWebsiteCategoryId } from '../../../../lib/website-category-validation'

const validate = (data?: Record<string, unknown>) =>
  validateWebsiteCategoryId('service', data?.service_category_id)

export default {
  beforeCreate(event: { params: { data?: Record<string, unknown> } }) {
    return validate(event.params.data)
  },
  beforeUpdate(event: { params: { data?: Record<string, unknown> } }) {
    return validate(event.params.data)
  },
}
