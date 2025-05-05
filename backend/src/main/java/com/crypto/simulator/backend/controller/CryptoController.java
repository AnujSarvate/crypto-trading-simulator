package com.crypto.simulator.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "http://localhost:3000")
public class CryptoController {

    private final RestTemplate restTemplate = new RestTemplate();
    private Object cachedResponse = null;
    private Instant lastFetchedTime = Instant.EPOCH; // long-ago initial value

    @GetMapping("/list")
    public ResponseEntity<?> getCryptoList() {
        Instant now = Instant.now();
        long secondsSinceLastFetch = java.time.Duration.between(lastFetchedTime, now).getSeconds();

        // If cache is fresh (under 5 minutes), return cached response
        if (cachedResponse != null && secondsSinceLastFetch < 300) {
            return ResponseEntity.ok(cachedResponse);
        }

        try {
            String url = "https://api.coingecko.com/api/v3/coins/markets" +
                    "?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (compatible; CryptoSimBot/1.0)");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            cachedResponse = response.getBody();
            lastFetchedTime = now;

            return ResponseEntity.ok(cachedResponse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch crypto data: " + e.getMessage());
        }
    }
}