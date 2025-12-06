package dreamfilmfestival.user.presentation;

import dreamfilmfestival.user.application.UserService;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.presentation.dto.SignUpRequest;
import dreamfilmfestival.user.presentation.dto.SignUpResponse;
import dreamfilmfestival.user.presentation.dto.UpdateUserRoleRequest;
import dreamfilmfestival.user.presentation.dto.UserSummaryResponse;
import dreamfilmfestival.user.presentation.dto.UserDtoMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserDtoMapper userDtoMapper;

    @PostMapping
    public ResponseEntity<SignUpResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        // DTO -> 도메인 파라미터 변환 (Presentation Layer 책임)
        User user = userService.signUp(
                request.username(),
                request.password(),
                request.email(),
                request.role()
        );
        SignUpResponse response = userDtoMapper.toSignUpResponse(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getUsers(
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDirection
    ) {
        List<UserSummaryResponse> responses = userService.findAll(sortField, sortDirection)
                .stream()
                .map(UserSummaryResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<UserSummaryResponse> updateRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        User updated = userService.updateRole(userId, request.role());
        return ResponseEntity.ok(UserSummaryResponse.from(updated));
    }
}

