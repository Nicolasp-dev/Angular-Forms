import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { CoursesService } from "../services/courses.service";
import { map, tap } from "rxjs/operators";

export function courseTitleValidator(
  courses: CoursesService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    console.log("Async Validation 01");
    return courses.findAllCourses().pipe(
      tap(() => console.log("Async Validation")),
      map((courses) => {
        const course = courses.find(
          (course) =>
            course.description.toLowerCase() == control.value.toLowerCase()
        );

        return course ? { titleExists: true } : null;
      })
    );
  };
}
