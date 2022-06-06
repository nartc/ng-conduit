import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../../data-access/api';
import { TypedFormGroup } from '../../utils/typed-form';

export interface ArticleFormData {
  title: string;
  body: string;
  description: string;
  tagList: string[];
}

@Component({
  selector: 'app-article-form',
  template: `
    <form [formGroup]="form">
      <fieldset>
        <fieldset class="form-group">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Article Title"
            formControlName="title"
          />
        </fieldset>
        <fieldset class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="What's this article about?"
            formControlName="description"
          />
        </fieldset>
        <fieldset class="form-group">
          <textarea
            class="form-control"
            rows="8"
            placeholder="Write your article (in markdown)"
            formControlName="body"
          ></textarea>
        </fieldset>
        <fieldset class="form-group">
          <input
            #tagInput
            type="text"
            class="form-control"
            placeholder="Enter tags"
            (keyup.enter)="addTag(tagInput)"
          />
          <div class="tag-list" *ngIf="form.value.tagList?.length">
            <span
              class="tag-pill tag-default"
              *ngFor="let tag of form.value.tagList"
            >
              <i class="ion-close-round" (click)="removeTag(tag)"></i>
              {{ ' ' + tag }}
            </span>
          </div>
        </fieldset>
        <button
          class="btn btn-lg pull-xs-right btn-primary"
          type="button"
          [disabled]="form.invalid"
          (click)="submit()"
        >
          Publish Article
        </button>
      </fieldset>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ArticleForm {
  @Input() set article(article: Article) {
    // set initial form value
    this.form.setValue({
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
    });
  }

  @Output() articleSubmit = new EventEmitter<ArticleFormData>();

  private readonly fb = inject(FormBuilder);

  readonly form: TypedFormGroup<ArticleFormData> = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    body: ['', [Validators.required]],
    tagList: [<string[]>[]],
  });

  submit() {
    this.articleSubmit.next(this.form.getRawValue());
  }

  addTag(tagInput: HTMLInputElement) {
    const trimmed = tagInput.value?.trim();

    if (!trimmed) return;

    this.form.controls.tagList.patchValue([
      ...this.form.controls.tagList.value,
      trimmed,
    ]);

    tagInput.value = '';
  }

  removeTag(tagToRemove: string) {
    this.form.controls.tagList.patchValue(
      this.form.controls.tagList.value.filter((tag) => tag !== tagToRemove)
    );
  }
}
