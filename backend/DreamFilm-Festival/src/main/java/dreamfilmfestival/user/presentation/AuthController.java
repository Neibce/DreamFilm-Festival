package dreamfilmfestival.user.presentation;

import dreamfilmfestival.user.application.AuthService;
import dreamfilmfestival.user.domain.User;
import dreamfilmfestival.user.presentation.dto.LoginRequest;
import dreamfilmfestival.user.presentation.dto.LoginResponse;
import dreamfilmfestival.user.presentation.dto.UserDtoMapper;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserDtoMapper userDtoMapper;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = authService.login(request);

        // 세션에 사용자 정보 저장
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userRole", user.getRole());

        LoginResponse response = userDtoMapper.toLoginResponse(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = authService.getMe(userId);
        return ResponseEntity.ok(userDtoMapper.toLoginResponse(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }
}

