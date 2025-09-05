import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import {
  CardComponent,
  CardContentComponent,
} from "community/components/cards";
import { DropdownComponent, DropdownItem } from "../dropdown.component";
import { DropdownItemComponent } from "../../dropdown-item/dropdown-item.component";
import { CdkListbox, CdkListboxModule } from "@angular/cdk/listbox";
import { CdkOverlayOrigin, OverlayModule } from "@angular/cdk/overlay";
import { TediTranslationPipe } from "tedi/services";

@Component({
  selector: "tedi-dropdown-overlay",
  imports: [
    CardComponent,
    CardContentComponent,
    DropdownItemComponent,
    CdkListboxModule,
    OverlayModule,
    TediTranslationPipe,
  ],
  templateUrl: "./dropdown-overlay.component.html",
  styleUrl: "./dropdown-overlay.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownOverlayComponent {
  dropdownOptions = input<DropdownItem[]>();
  activeOption = input<DropdownItem | undefined>();
  isOpen = input<boolean>();
  buttonId = input<string>();

  triggerRef = viewChild(CdkOverlayOrigin, { read: ElementRef });
  listboxRef = viewChild(CdkListbox, { read: ElementRef });

  focusListboxWhenVisible = effect(() => {
    if (this.listboxRef()) {
      this.listboxRef()?.nativeElement.focus();
    }
  });

  onOpen = effect(() => {
    if (this.isOpen()) {
      this.triggerRef()?.nativeElement.focus();
    }
  });
}
