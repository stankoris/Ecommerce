package com.ecommerce.store.filter;

import com.ecommerce.store.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("JWT Token extraction failed", e);
            }
        }

        if (email != null && jwtUtil.validateToken(jwt)) {
            // Token is valid - you can add user to security context here if needed
            request.setAttribute("userId", jwtUtil.extractUserId(jwt));
            request.setAttribute("userEmail", email);
            request.setAttribute("userRole", jwtUtil.extractRole(jwt));
        }

        filterChain.doFilter(request, response);
    }
}