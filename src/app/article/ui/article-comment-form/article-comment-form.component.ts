import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Profile } from '../../../shared/data-access/api';
import { TypedFormGroup } from '../../../shared/utils/typed-form';

@Component({
  selector: 'app-article-comment-form[currentUser]',
  template: `
    <form [formGroup]="form" class="card comment-form" (ngSubmit)="submit()">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          formControlName="comment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          [src]="currentUser.image"
          alt="Avatar of current user"
          class="comment-author-img"
        />
        <button type="submit" class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class ArticleCommentForm {
  @Input() currentUser!: Profile;

  @Output() comment = new EventEmitter<string>();

  private readonly fb = inject(FormBuilder);

  readonly form: TypedFormGroup<{ comment: string }> =
    this.fb.nonNullable.group({
      comment: [''],
    });

  submit() {
    this.comment.emit(this.form.getRawValue().comment);
    this.form.reset();
  }
}
