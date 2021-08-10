package io.clouditor.examples.patient_community;

@Retention(RetentionPolicy.Source)
@Target(ElementType.Type)
public @interface PrivacyLabel {
  int level() default 0;
}
