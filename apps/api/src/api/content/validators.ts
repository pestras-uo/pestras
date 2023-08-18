import { ContentViewType } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";

export enum ContentValidators {
  ADD_VIEW = 'addContentView',
  UPDATE_VIEWS_ORDER = 'orderContentViews',
  UPDATE_VIEW = 'updateContentView',
  UPDATE_VIEW_CONTENT = 'updateContentViewContent'
}

new Validall(ContentValidators.ADD_VIEW, {
  title: { $type: 'string', $nullable: true },
  sub_title: { $type: 'string', $nullable: true },
  type: {
    $enum: [
      ContentViewType.RICH_TEXT,
      ContentViewType.IMAGE,
      ContentViewType.VIDEO
    ],
  },
  content: { $type: 'string', $nullable: true }
});

new Validall(ContentValidators.UPDATE_VIEWS_ORDER, {
  views: { $default: [], $each: { $type: 'string' } }
});

new Validall(ContentValidators.UPDATE_VIEW, {
  title: { $type: 'string', $nullable: true },
  sub_title: { $type: 'string', $nullable: true },
  type: {
    $enum: [
      ContentViewType.RICH_TEXT,
      ContentViewType.IMAGE,
      ContentViewType.VIDEO
    ],
  },
  content: { $type: 'string', $nullable: true }
});

new Validall(ContentValidators.UPDATE_VIEW_CONTENT, {
  content: { $type: 'string', $nullable: true }
});

