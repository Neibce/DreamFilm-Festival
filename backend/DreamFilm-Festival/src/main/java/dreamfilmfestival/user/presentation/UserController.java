package dreamfilmfestival.user.presentation;

import dreamfilmfestival.user.application.UserService;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.presentation.dto.SignUpRequest;
import dreamfilmfestival.user.presentation.dto.SignUpResponse;
import dreamfilmfestival.user.presentation.dto.UserDtoMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getRole()
        );
        SignUpResponse response = userDtoMapper.toSignUpResponse(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

