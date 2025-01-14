<!-- Common Component Template (Intégré à vos styles) -->
<div class="common-component">
  <!-- Header Section -->
  <header class="header">
    <div class="header_title">
      <h1>{{ component.title }}</h1>
      <h4>{{ component.description }}</h4>
    </div>
  </header>

  <!-- Navigation Section -->
  <nav class="navigation">
    <ul>
      {%- for item in component.navigation -%}
        <li class="navigation__item">
          <a href="{{ item.url | relative_url }}">{{ item.label }}</a>
        </li>
      {%- endfor -%}
    </ul>
  </nav>

  <!-- Main Content Section -->
  <main class="team-container">
    {%- for contentBlock in component.contentBlocks -%}
      <div class="team-card">
        <img src="{{ contentBlock.image | relative_url }}" alt="{{ contentBlock.title }}" class="team-photo">
        <h3>{{ contentBlock.title }}</h3>
        <p>{{ contentBlock.description }}</p>
      </div>
    {%- endfor -%}
  </main>

  <!-- Footer Section -->
  <footer class="footer">
    <div class="site-info">
      <p>&copy; {{ site.time | date: '%Y' }} {{ site.title }}</p>
    </div>
    <div class="financeurs-footer">
      <h4>Financeurs</h4>
      <div class="financeurs-list">
        {%- for sponsor in component.sponsors -%}
          <div class="financeur-item">
            <img src="{{ sponsor.logo | relative_url }}" alt="{{ sponsor.name }}" class="financeur-logo">
          </div>
        {%- endfor -%}
      </div>
    </div>
  </footer>
</div>
