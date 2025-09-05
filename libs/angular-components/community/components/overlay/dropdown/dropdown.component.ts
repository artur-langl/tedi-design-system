import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import {
  AfterContentChecked,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  ChangeDetectionStrategy,
  model,
  signal,
} from "@angular/core";
import {
  IconComponent,
  TediTranslationPipe,
  ButtonComponent,
  ButtonVariant,
} from "@tehik-ee/tedi-angular/tedi";

export interface DropdownItem {
  label: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
}

@Component({
  selector: "tedi-dropdown",
  imports: [
    TediTranslationPipe,
    ButtonComponent,
    IconComponent,
    ButtonComponent,
    CdkOverlayOrigin,
  ],
  templateUrl: "./dropdown.component.html",
  styleUrl: "./dropdown.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnInit, AfterContentChecked {
  dropdownOptions = input.required<DropdownItem[]>();
  buttonId = input<string>();
  variant = input<ButtonVariant>("secondary");

  isOpen = model(false);
  dropdownWidth = model(0);

  activeOption = signal<DropdownItem | undefined>(undefined);

  selectedOption = output<DropdownItem>();

  hostRef = inject(ElementRef);

  @HostListener("window:resize")
  onWindowResize() {
    this.setDropdownWidth();
  }

  ngOnInit(): void {
    this.setInitialActiveOption();
  }

  ngAfterContentChecked(): void {
    this.setDropdownWidth();
  }

  setInitialActiveOption(): void {
    const initialActiveOption = this.dropdownOptions().find(
      (option) => option.active
    );
    if (initialActiveOption) {
      this.activeOption.set(initialActiveOption);
    } else {
      const notDisabledOption = this.dropdownOptions().find(
        (option) => !option.disabled
      );
      if (notDisabledOption) {
        this.activeOption.set(notDisabledOption);
      }
    }
  }

  handleValueChange(event: { value: readonly string[] }): void {
    const option = this.dropdownOptions().find(
      (o) => o.value === event.value[0]
    );
    if (option && !option.disabled) {
      this.activeOption.set(option);
      this.selectedOption.emit(option);
      this.toggleIsOpen(false);
    }
  }

  toggleIsOpen(value?: boolean): void {
    this.isOpen.set(value ?? !this.isOpen());
  }

  private setDropdownWidth(): void {
    const computedWidth =
      this.hostRef?.nativeElement?.getBoundingClientRect()?.width ?? 0;
    this.dropdownWidth.set(computedWidth);
  }
}
