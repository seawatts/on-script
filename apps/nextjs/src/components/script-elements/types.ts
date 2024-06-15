export enum ElementType {
  ACTION = "ACTION",
  DIALOGUE = "DIALOGUE",
  DESCRIPTION = "DESCRIPTION",
  SLUG_LINE = "SLUG_LINE",
  PARENTHETICAL = "PARENTHETICAL",
  SHOT = "SHOT",
  TRANSITION = "TRANSITION",
  CAPTION = "CAPTION",
}

export enum DialogDirection {
  VOICE_OVER,
  OFF_SCREEN,
  PRELAP,
}

export interface BaseElement {
  type: ElementType;
  text: string;
}

export interface ActionElement extends BaseElement {
  type: ElementType.ACTION;
}

export interface DialogElement extends BaseElement {
  type: ElementType.DIALOGUE;
  character: string;
  direction?: DialogDirection;
  continued?: boolean;
  prelap?: boolean;
}

export interface TransitionElement extends BaseElement {
  type: ElementType.TRANSITION;
}

export interface ParentheticalElement extends BaseElement {
  type: ElementType.PARENTHETICAL;
  character: string;
}

export interface SlugLineElement extends BaseElement {
  type: ElementType.SLUG_LINE;
  interior: boolean;
  exterior: boolean;
  location: string;
  specificLocation?: string;
  time: string;
}

export interface CaptionElement extends BaseElement {
  type: ElementType.CAPTION;
}

export type Element =
  | ActionElement
  | DialogElement
  | TransitionElement
  | ParentheticalElement
  | SlugLineElement
  | CaptionElement;

export interface IScene {
  id: string;
  elements: Element[];
}
